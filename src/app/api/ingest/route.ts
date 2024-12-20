import { AxiomRequest, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const POST = withAxiom(async (req: AxiomRequest) => {
  const targetEndpoint = process.env.TARGET_ENDPOINT!;
  req.log.info(`Forwarding request to: ${targetEndpoint}`);

  try {
    // Parse the FormData from the incoming request
    const forwardBody = await req.formData();
    const forwardHeaders = new Headers(req.headers);

    // Remove headers that shouldn't be forwarded
    forwardHeaders.delete("host");
    forwardHeaders.delete("connection");
    forwardHeaders.delete("content-length"); // Allow fetch to recalculate this
    forwardHeaders.delete("content-type"); // Allow fetch to set the correct boundary for FormData

    // Forward the request
    const forwardResponse = await fetch(targetEndpoint, {
      method: "POST",
      headers: forwardHeaders,
      body: forwardBody,
    });

    // Retrieve and log the response
    const responseStatus = forwardResponse.status;
    req.log.info(`Response status: ${responseStatus}`);
    const responseData = await forwardResponse.json();

    req.log.info("Response data:", responseData);

    // Send back the response from the target endpoint
    return NextResponse.json({ status: "success", data: responseData });
  } catch (error) {
    console.error("Error forwarding request:", error);
    return NextResponse.json(
      {
        message: "Error forwarding request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
