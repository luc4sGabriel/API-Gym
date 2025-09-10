import request from "supertest";
import { app } from "../../../app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUserForTests } from "@/utils/test/create-and-authenticate-user";

describe('Search Gyms Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to search a gym', async () => {
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
                latitude: -24.5505,
                longitude: -48.6333
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                 query: 'Javascript' 
            })
            .set('Authorization', `Bearer ${token}`) 
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Javascript Gym 3123'
            })
        ])
    })
})