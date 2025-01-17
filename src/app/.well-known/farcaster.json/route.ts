export async function GET() {
  const appUrl = "https://wallet-connect-iota.vercel.app/";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjk0OTQyOSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJlMWNGOTA2NjYzZjRjYTVBZTlDYzdlQjlFNjFCNTgxMjRkZkQ4MjEifQ",
      payload: "eyJkb21haW4iOiJ3YWxsZXQtY29ubmVjdC1pb3RhLnZlcmNlbC5hcHAifQ",
      signature:
        "MHgxODdmZGE1NmFjZDI3ZjdlNWM3ODg5YTc0MzRmMjA1Nzg1NzFjYWRmZTZkMzhhYmRmOTA4ZDVjNDliNzgxZWEzMzM5ZTk5NDVkZDI1NjllOGEwZjM1NjMwMjU1ZTczYjkwYTZmY2JlYTVmM2Q3ZTIxNzFkYzFhNWY3NTc0N2NmMTFj",
    },
    frame: {
      version: "1",
      name: "Example Frame",
      iconUrl: "https://wallet-connect-iota.vercel.app/icon.png",
      homeUrl: "https://wallet-connect-iota.vercel.app",
      imageUrl: "https://wallet-connect-iota.vercel.app/image.png",
      buttonTitle: "Check this out",
      splashImageUrl: "https://wallet-connect-iota.vercel.app/splash.png",
      splashBackgroundColor: "#eeccff",
      webhookUrl: "https://wallet-connect-iota.vercel.app/api/webhook",
    },
  };

  return Response.json(config);
}
