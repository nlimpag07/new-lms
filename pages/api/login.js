// We don't actually do any validation here because
// that's not the point of this demo.
export default (req, res) => {
  //console.log(req.body)
  res.setHeader(
    "Set-Cookie",
    ["session=1; Max-Age=86400; SameSite=Strict; HttpOnly; Path=/","usertype=" +
    req.body.userType +
    "; Max-Age=86400; SameSite=Strict; HttpOnly; Path=/"]
  );

  //console.log(res);
  res.status(200).end();
};
