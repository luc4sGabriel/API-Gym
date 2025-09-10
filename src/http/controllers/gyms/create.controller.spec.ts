import request from "supertest";
import { app } from "../../../app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUserForTests } from "@/utils/test/create-and-authenticate-user";

describe('Create Gym Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUserForTests(app)

        const response = await request(app.server)
            .post('/gyms/new')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Javascript Gym 3123',
                description: 'A great gym',
                phone: '123456789',
                latitude: -23.5505,
                longitude: -46.6333
            })

        expect(response.statusCode).toEqual(201)
    })
})