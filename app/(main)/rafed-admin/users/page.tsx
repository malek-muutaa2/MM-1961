import type {Metadata} from "next"

import {UserManagement} from "@/components/rafed-admin/user-management"
import {getusers, TotalUsers} from "@/lib/user"
import {UserType} from "@/lib/db/schema"
import {SearchParamsProps} from "@/lib/type"

export const metadata: Metadata = {
    title: "User Management | Rafed Admin",
    description: "Manage users, invite providers and suppliers, and add administrators",
}

export default async function DemoHome({
                                           searchParams,
                                       }: Readonly<SearchParamsProps>) {

    const {page, column, order, search} = await searchParams;
    const pageNumber = Number(page ?? 1);
    const sizelimit = 10;
    const columnparam = String(column ?? "id");
    const orderparam = String(order ?? "undefined");
    const prevSearchParams = new URLSearchParams();
    const nextSearchParams = new URLSearchParams();
    let safePageNumber = 1;
    const numberOfItems = sizelimit;
    const searchparam =
        typeof search === "string" ? search : null;
    const offsetItems = (Number(pageNumber) - 1) * numberOfItems;
    const Total = await TotalUsers(search)
    const users: UserType[] = await getusers(
        offsetItems,
        searchparam,
        numberOfItems,
        columnparam,
        orderparam,
    );
    const numberOfPages = Total[0]?.count
        ? Math.ceil(Total[0]?.count / numberOfItems)
        : 1;

    if (safePageNumber > 2) {
        prevSearchParams.set("numberOfItems", `${numberOfItems}`);
        prevSearchParams.set("page", `${safePageNumber - 1}`);
    } else {
        prevSearchParams.delete("page");
    }

    if (safePageNumber > 0) {
        if (safePageNumber === numberOfPages) {
            nextSearchParams.set("page", `${numberOfPages}`);
        } else {
            nextSearchParams.set("page", `${safePageNumber + 1}`);
        }
        nextSearchParams.set("numberOfItems", `${numberOfItems}`);
    } else {
        nextSearchParams.delete("page");
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage users, invite providers and suppliers, and add
                    administrators</p>
            </div>
            <UserManagement
                column={columnparam}
                numberOfPages={numberOfPages}
                order={orderparam}
                pageNumber={pageNumber}
                pathname="/rafed-admin/users"
                search={search}
                size="10"
                users={users}/>
        </div>
    )
}
