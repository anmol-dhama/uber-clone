import { IUser } from '../../models/user.model';
import {ICaptain} from '../../models/captain.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      captain?: ICaptain
    }
  }
}
