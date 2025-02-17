# Setup

> ⚠️ In all documentation we reference `PROJECT_ID` is your Google Cloud Project ID ⚠️

> ⚠️ Follow each step, don't skip any of them. ⚠️

## Infra (Google cloud/Firebase)

### Setup
13. Click on `Add key > Create new key` and select `JSON`
14. Move and rename your json file to `.infra/terraform-cred.json`

### Terraform

1. Go to `.infra` folder
2. Install `Terraform` running `brew install hashicorp/tap/terraform` 
3. Setup your project  `terraform init && terraform validate`
4. Run `terraform apply -auto-approve`

## Firebase configuration

> ⚠️ We will refer to https://console.firebase.google.com/project/PROJECT_ID/overview ⚠️  

### Analytics

1. Go to `Analytics > Analytics Dashboard` (Menu on the left) and `Active Google analytics`
2. Select all check and click on `Enable Google Analytics`
3. Select `MyGame Mobile App`
4. Select `Default Firebase account`
5. Select your webapp
6. Finish and Finish

### Remote config

1. Go to `Analytics >  Custom definitions` (Menu on the left) click on `Create custom definition` 
2. Set the custom definition for `fed_id` :
   - Dimension name: `fed_id`
   - Scope: `User`
   - Description: `fed_id`
   - Event Parameter: `fed_id`
3. Do the same for `is_beta_tester` custom definition

### Functions

1. On your code, Copy/Past from `back/.env.my-game-mobile` to `./back/.env.PROJECT_ID`
2. In this file set the value `SERVICE_ACCOUNT` by `function-invoker@PROJECT_ID.iam.gserviceaccount.com`

### Hosting

1. To have a working authentication with FED you must reference your `redirect URL` to https://loginwith.subsidia.org/fr/dashboard (ZScaller required)
2. Select `MyGame Mobile` project and click `Détails` button
3. Click on `Modifier Callback URL` and add `https://PROJECT_ID.web.app/token` and click on `Modifier`

## Deployment

1. Go to your Google Cloud Console, [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?hl=en&project=PROJECT_ID)
2. On the line `ci-cd-github@PROJECT_ID.iam.gserviceaccount.com`, click on the 3 dots (end of the line) and click on `Manage keys`
3. Click on `Add key > Create new key` and select `JSON`
4. If you use a Mac convert your created key by running from your terminal `base64 -i my-key.json -o base64-key.txt`
5. Go to your Github repository, `Settings > Environment` and add a new secret `GCP_SA_KEY` with the value of your base64 key
6. Now you can use to deploy your application using `w9jds/firebase-action` github actions


---


#### Create `RENOVATE_TOKEN`

1. Go to https://github.com/settings/tokens
2. Generate `New personal access token (classic)`
- **Note**: Renovate
- **Expiration**: No expiration
- [x] `repo`
- [x] `workflow`

