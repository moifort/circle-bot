variable "projectId" {
  description     = "Project ID"
  type            = string
}

terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

provider "google-beta" {
  user_project_override = true
  region = "europe-west1"
  credentials = file("terraform-cred.json")
}


provider "google-beta" {
  alias = "no_user_project_override"
  user_project_override = false
  credentials = file("terraform-cred.json")
}

resource "google_project_service" "default" {
  provider = google-beta.no_user_project_override
  project  = var.projectId
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    "serviceusage.googleapis.com",
    "eventarc.googleapis.com",
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.projectId

  # Waits for the required APIs to be enabled.
  depends_on = [
    google_project_service.default
  ]
}

resource "google_firestore_database" "default" {
  provider                    = google-beta
  project                     = var.projectId
  name                        = "(default)"
  # See available locations: https://firebase.google.com/docs/projects/locations#default-cloud-location
  location_id                 = "europe-west1"
  # "FIRESTORE_NATIVE" is required to use Firestore with Firebase SDKs, authentication, and Firebase Security Rules.
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "OPTIMISTIC"

  # Wait for Firebase to be enabled in the Google Cloud project before initializing Firestore.
  depends_on = [
    google_firebase_project.default,
  ]
}

resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = var.projectId
  display_name = var.projectId + "-web"

  # The other App types (Android and Apple) use "DELETE" by default.
  # Web apps don't use "DELETE" by default due to backward-compatibility.
  deletion_policy = "DELETE"

  # Wait for Firebase to be enabled in the Google Cloud project before creating this App.
  depends_on = [
    google_firebase_project.default,
  ]
}


resource "google_service_account" "ci_cd_github" {
  provider = google-beta
  project      = var.projectId
  account_id   = "ci-cd-github"
  display_name = "CI/CD"
}

resource "google_project_iam_member" "ci_cd_github_roles" {
  provider = google-beta
  project = var.projectId
  for_each = toset([
    "roles/appengine.appAdmin",
    "roles/datastore.indexAdmin",
    "roles/cloudfunctions.admin",
    "roles/cloudfunctions.developer",
    "roles/cloudscheduler.admin",
    "roles/firebase.admin",
    "roles/firebasehosting.admin",
    "roles/firebaserules.admin",
    "roles/secretmanager.viewer",
    "roles/iam.serviceAccountUser",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.ci_cd_github.email}"
}


resource "google_service_account" "function_invoker" {
  provider = google-beta
  project      = var.projectId
  account_id   = "function-invoker"
  display_name = "Function invoker"
}


resource "google_project_iam_member" "function_invoker_roles" {
  provider = google-beta
  project = var.projectId
  for_each = toset([
    "roles/datastore.owner",
    "roles/cloudfunctions.invoker",
  ])
  role    = each.key
  member  = "serviceAccount:${google_service_account.function_invoker.email}"
}
