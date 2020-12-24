import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

const privateKEY = fs.readFileSync('./private.key', 'utf8');
const publicKEY = fs.readFileSync('./public.key', 'utf8');

@Injectable()
export class TokenService {
  async generateToken(staff): Promise<string> {
    return new Promise((resolve, reject) => {
      const objectStaff = {
        jti: staff.jti,
        id: staff.id,
        email: staff.email,
        deviceId: staff.deviceId,
        roleCode: staff.roleCode,
      };

      jwt.sign(
        objectStaff,
        privateKEY,
        {
          algorithm: 'RS256',
          expiresIn: process.env.ACCESS_TOKEN_LIFE,
        },
        (error, token) => {
          if (error) {
            return reject(error);
          }
          resolve(token);
        },
      );
    });
  }

  verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKEY, (error, decoded) => {
        if (error) {
          return reject(error);
        }
        resolve(decoded);
      });
    });
  }

  async generateRefreshToken(staff): Promise<string> {
    return new Promise((resolve, reject) => {
      const staffData = { id: staff.id, jti: staff.jti };

      jwt.sign(
        staffData,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_LIFE },
        (error, token) => {
          if (error) {
            return reject(error);
          }
          resolve(token);
        },
      );
    });
  }

  async verifyRefreshToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error) {
          return reject(error);
        }
        resolve(decoded);
      });
    });
  }
}
