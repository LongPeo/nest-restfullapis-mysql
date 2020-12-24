
INSERT INTO `role`(name, access) VALUES ('Quản trị hệ thống', '*')

INSERT INTO `staff`(email, password, salt, fullName, mobile, address, status, roleId)
VALUES (
  'admin@gmail.com',
  '486ccd30c01bd861f79797bacdf23fd53bb93cfa8f3ce4ccd4be46232c34d3b5fe54ce85876687b161556deace02451ff6e6760c6b14f3400490b67d2d4491e3',
  '8fac13aa69',
  'admin', 
  '0374539633',
  'HCM',
  'ACTIVATED',
  1
);

