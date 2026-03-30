import app from "@/app";
import { appConfig } from "@/config/app.config";
import { connectDatabase } from "@/infrastructure/database";

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  app.listen(appConfig.PORT, () => {
    console.log(`Server is runing at: localhost:${appConfig.PORT}`);
  });
};

void bootstrap();
