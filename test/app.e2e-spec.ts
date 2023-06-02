import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';
import { useContainer } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const promptShape = expect.objectContaining({
    id: expect.any(Number),
    content: expect.any(String),
    status: expect.any(String),
  });

  const promptData = [
    {
      id: 1001,
      content: 'This is a test prompt',
      status: Status.FAILURE,
    },
    {
      id: 1002,
      content: 'This is another test prompt',
      status: Status.IN_PROGRESS,
    },
    {
      id: 1003,
      content: 'This is a third test prompt',
      status: Status.PENDING,
    },
    {
      id: 1004,
      content: 'This is a fourth test prompt',
      status: Status.SUCCESS,
    },
  ];

  const addPromptEntryToPrisma = (
    promptData: {
      id: number;
      content: string;
      status: Status;
    },
    prisma: PrismaService,
  ) => {
    return prisma.prompt.create({
      data: promptData,
    });
  };

  const processEntries = async (prisma) => {
    const entries = [];
    for (const prompt of promptData) {
      const entry = await addPromptEntryToPrisma(prompt, prisma);
      entries.push(entry);
    }
    return entries;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await processEntries(prisma);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/prompts', () => {
    it('GET /prompts', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/prompts',
      );

      expect(status).toEqual(200);
      expect(body).toStrictEqual(expect.arrayContaining([promptShape]));
      expect(body).toHaveLength(4);
      expect(body[0].id).toEqual(promptData[0].id);
      expect(body[0].content).toEqual(promptData[0].content);
      expect(body[0].status).toEqual(promptData[0].status);
    });

    it('GET /prompts/failures', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/prompts/failures',
      );

      expect(status).toEqual(200);
      expect(body).toStrictEqual(expect.arrayContaining([promptShape]));
      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(promptData[0].id);
      expect(body[0].content).toEqual(promptData[0].content);
      expect(body[0].status).toEqual(promptData[0].status);
    });

    it('GET /prompts/:id', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/prompts/1001',
      );

      expect(status).toEqual(200);
      expect(body).toStrictEqual(promptShape);
      expect(body.id).toEqual(promptData[0].id);
      expect(body.content).toEqual(promptData[0].content);
      expect(body.status).toEqual(promptData[0].status);
    });

    it("GET /prompts/:id with invalid id's", async () => {
      const { status } = await request(app.getHttpServer()).get('/prompts/one');

      expect(status).toEqual(400);
    });

    it('GET /prompts/:id with 404 errors', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/prompts/999',
      );

      expect(status).toEqual(404);
      expect(body).toStrictEqual({
        statusCode: 404,
        message: 'Prompt #999 not found',
        error: 'Not Found',
      });
    });

    it('POST /prompts', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/prompts')
        .send({
          content: 'This is a new test prompt',
        });

      expect(status).toEqual(201);
      expect(body).toStrictEqual(promptShape);
      expect(body.content).toEqual('This is a new test prompt');
      expect(body.status).toEqual(Status.PENDING);
    });

    it('DELETE /prompts/:id', async () => {
      const { status, body } = await request(app.getHttpServer()).delete(
        '/prompts/1001',
      );

      expect(status).toEqual(200);
      expect(body).toStrictEqual(promptShape);
      expect(body.id).toEqual(promptData[0].id);
      expect(body.content).toEqual(promptData[0].content);
      expect(body.status).toEqual(promptData[0].status);
    });

    it('DELETE /prompts/:id with invalid id', async () => {
      const { status } = await request(app.getHttpServer()).delete(
        '/prompts/one',
      );

      expect(status).toEqual(400);
    });

    it('DELETE /prompts/:id with 404 errors', async () => {
      const { status } = await request(app.getHttpServer()).delete(
        '/prompts/999',
      );

      expect(status).toEqual(404);
    });
  });
});
