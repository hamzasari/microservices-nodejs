import jwt from 'jsonwebtoken';

const requireAdmin = (req: any, res: any, next: any) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send('Unauthorized');
  }
  console.log('authorization', process.env.JWT_SECRET);
  const token = authorization.split(' ')[1];
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET ?? 'DEFAULT SECRET'
  ) as { isAdmin: boolean };
  console.log(decoded);
  if (!decoded.isAdmin) {
    return res.status(403).send('Forbidden');
  }
  next();
};

export default requireAdmin;
