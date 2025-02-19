"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/atoms/table";
import * as React from "react";

const data = [
	{
		id: "m5gr84i9",
		amount: 316,
		status: "success",
		email: "ken99@yahoo.com",
	},
	{
		id: "3u1reuv4",
		amount: 242,
		status: "success",
		email: "Abe45@gmail.com",
	},
	{
		id: "derv1ws0",
		amount: 837,
		status: "processing",
		email: "Monserrat44@gmail.com",
	},
	{
		id: "5kma53ae",
		amount: 874,
		status: "success",
		email: "Silas22@gmail.com",
	},
	{
		id: "bhqecj4p",
		amount: 721,
		status: "failed",
		email: "carmella@hotmail.com",
	},
];

export function Bets() {
	return (
		<div className="w-full">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Id</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell> 1</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
