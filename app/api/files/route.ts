import { type NextRequest, NextResponse } from "next/server"
import { list, del } from "@vercel/blob"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get("prefix") ?? ""
    const limit = Number.parseInt(searchParams.get("limit") ?? "50")

    const result = await list({
      prefix,
      limit,
    })

    return NextResponse.json({
      files: result.blobs.map((blob: any) => ({
        id: blob.pathname,
        name: blob.pathname.split("/").pop(),
        url: blob.url,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        pathname: blob.pathname,
      })),
    })
  } catch (error) {
    console.error("Failed to list files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get("pathname")

    if (!pathname) {
      return NextResponse.json({ error: "Pathname is required" }, { status: 400 })
    }

    await del(pathname)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
