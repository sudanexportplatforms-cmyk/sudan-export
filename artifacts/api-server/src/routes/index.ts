import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import productsRouter from "./products";
import companiesRouter from "./companies";
import rfqsRouter from "./rfqs";
import quotationsRouter from "./quotations";
import messagesRouter from "./messages";
import notificationsRouter from "./notifications";
import dashboardRouter from "./dashboard";
import documentsRouter from "./documents";
import emailLogsRouter from "./email_logs";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/companies", companiesRouter);
router.use("/rfqs", rfqsRouter);
router.use("/quotations", quotationsRouter);
router.use("/messages", messagesRouter);
router.use("/notifications", notificationsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/documents", documentsRouter);
router.use("/email-logs", emailLogsRouter);

export default router;
