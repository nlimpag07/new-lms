// We don't actually do any validation here because
// that's not the point of this demo.
export default (req, res) => {
  //console.log(req.body)
  res.setHeader("Set-Cookie", [
    "session=1; Max-Age=86400; SameSite=Strict; HttpOnly; Path=/",
    "usertype=" +
      req.body.userType +
      "; Max-Age=86400; SameSite=Strict; HttpOnly; Path=/",
    "token=" +
      req.body.token +
      "; Max-Age=86400; SameSite=Strict; HttpOnly; Path=/",
  ]);

  //console.log(res);
  //res.send(JSON.stringify(req.body));
  

  //res.end(JSON.stringify(req.body));
  res.status(200).json({ status: 200 })
  //res.status(200).end();
};
