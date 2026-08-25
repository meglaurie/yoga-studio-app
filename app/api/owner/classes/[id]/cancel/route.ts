import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/authorization";
import { cancelClass, ClassCancellationError } from "@/lib/class-cancellation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: RouteContext) {
  try {
    await requireOwner();

    const { id } = await params;
    const result = await cancelClass(id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Owner access required." },
        { status: 403 },
      );
    }

    if (error instanceof ClassCancellationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Cancel class error:", error);

    return NextResponse.json(
      { error: "Unable to cancel class." },
      { status: 500 },
    );
  }
}