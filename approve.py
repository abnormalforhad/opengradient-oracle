import opengradient as og

pk = "0x084a3eb5646150436c58625a9c4ab21d0ced4e5ed20c2974a6417b528fcd1b3b"
print(f"Approving wallet for OpenGradient x402...")
try:
    client = og.LLM(private_key=pk)
    # Give generic high approval so they never have to do this again
    res = client.ensure_opg_approval(opg_amount=100.0)
    print("Approval success:", res)
except Exception as e:
    print("Approval failed:", e)
