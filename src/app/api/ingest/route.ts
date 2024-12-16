import { AxiomRequest, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const POST = withAxiom(async (req: AxiomRequest) => {
  req.log.info("Ingesting data...");

  const targetEndpoint = process.env.TARGET_ENDPOINT!;

  try {
    // Forward the entire request to the target endpoint
    const forwardResponse = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        // Forward all original headers, except for host and connection headers
        ...Object.fromEntries(
          Object.entries(req.headers).filter(
            ([key]) => !["host", "connection"].includes(key.toLowerCase())
          )
        ),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    // Get the response data and status from the forwarded request
    const responseStatus = forwardResponse.status;
    req.log.info(`Response status: ${responseStatus}`);

    const responseData = await forwardResponse.json();
    req.log.info("Response data:", responseData);

    // Send back the exact response from the target endpoint
    return NextResponse.json({ status: "success", data: responseData });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.log.error("Error forwarding request:", error as any);
    return NextResponse.json({
      status: "error",
      message: "Error forwarding request",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
