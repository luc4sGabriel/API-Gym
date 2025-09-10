import request from "supertest";
import { app } from "../../../app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUserForTests } from "@/utils/test/create-and-authenticate-user";

describe('Search Nearby Gyms Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to search a nearby gym', async () => {
        const { token } = await createAndAuthenticateUserForTests(app)

        await request(app.server)
            .post('/gyms/new')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                title: 'Javascript Gym 3123',
                description: 'A great gym',
                phone: '123456789',
                latitude: -23.5505,
                longitude: -46.6333
            })

        await request(app.server)
            .post('/gyms/new')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                title: 'Typescript Gym 3124',
                description: 'A great gym',
                phone: '123456789',
                latitude: -8.292173,
                longitude: -35.978692
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                 latitude: -8.290340, 
                 longitude: -35.979232 
            })
            .set('Authorization', `Bearer ${token}`) 
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Typescript Gym 3124'
            })
        ])
    })
})