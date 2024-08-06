import { Router } from "express";

// import { callblack, Payment, transaction } from "../controllers/momo.js";
import { Payment } from './../controllers/momo.js';


const PaymentRouter = Router();

PaymentRouter.post("/payment", Payment);

export default PaymentRouter;