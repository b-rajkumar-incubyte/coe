import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/task (GET)', () => {
    return request(app.getHttpServer())
      .get('/task')
      .expect(200)
      .expect([]);
  });

  async function createTask(title: string, description?: string): Promise<number> {
    const body: Record<string, string> = { title };
    if (description !== undefined) body.description = description;
    const res = await request(app.getHttpServer())
      .post('/task')
      .send(body)
      .expect(201);
    // POST returns a plain number — parse from text since supertest .body is {} for primitives
    return parseInt(res.text, 10);
  }

  describe('DELETE /task/:id', () => {
    it('returns 204 with no body when the task exists', async () => {
      const id = await createTask('Task to delete');

      const deleteRes = await request(app.getHttpServer())
        .delete(`/task/${id}`)
        .expect(204);

      expect(deleteRes.body).toEqual({});
    });

    it('returns 404 when the task does not exist', () => {
      return request(app.getHttpServer())
        .delete('/task/9999')
        .expect(404);
    });
  });

  describe('PATCH /task/:id', () => {
    it('returns 200 with the updated task when updating the title', async () => {
      const id = await createTask('Original title');

      const patchRes = await request(app.getHttpServer())
        .patch(`/task/${id}`)
        .send({ title: 'Updated title' })
        .expect(200);

      expect(patchRes.body).toMatchObject({
        id,
        title: 'Updated title',
        status: 'Not started',
      });
    });

    it('returns 200 with the task reflecting the new status when updating status', async () => {
      const id = await createTask('Status task');

      const patchRes = await request(app.getHttpServer())
        .patch(`/task/${id}`)
        .send({ status: 'In progress' })
        .expect(200);

      expect(patchRes.body).toMatchObject({
        id,
        title: 'Status task',
        status: 'In progress',
      });
    });

    it('returns 200 with all provided fields updated when patching multiple fields at once', async () => {
      const id = await createTask('Multi-field task');

      const patchRes = await request(app.getHttpServer())
        .patch(`/task/${id}`)
        .send({ title: 'New title', description: 'Added desc', status: 'Done' })
        .expect(200);

      expect(patchRes.body).toEqual({
        id,
        title: 'New title',
        description: 'Added desc',
        status: 'Done',
      });
    });

    it('returns 404 when the task does not exist', () => {
      return request(app.getHttpServer())
        .patch('/task/9999')
        .send({ title: 'Ghost update' })
        .expect(404);
    });

    it('returns 400 when the status value is not one of the allowed values', async () => {
      const id = await createTask('Validation task');

      return request(app.getHttpServer())
        .patch(`/task/${id}`)
        .send({ status: 'invalid-status' })
        .expect(400);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
