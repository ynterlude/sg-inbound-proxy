import { AxiomRequest, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const POST = withAxiom(async (req: AxiomRequest) => {
  const formData = await req.formData();
  console.log(formData);
  return NextResponse.json({
    message: "I am the response from the target endpoint",
  });
});
