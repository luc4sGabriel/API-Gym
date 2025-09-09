import request from "supertest";
import { app } from "../../app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Profile Controller (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to get user profile', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe 2',
                email: 'johndoe@example.com',
                password: '123456'
            })

        const authResponse = await request(app.server)
            .post('/sessions')
            .send({
                email: 'johndoe@example.com',
                password: '123456'
            })

        const { token } = authResponse.body

        const profileResponse = await request(app.server)
            .get('/profile')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(profileResponse.statusCode).toEqual(200)
        expect(profileResponse.body).toEqual(expect.objectContaining({
            user: {
                "email": "johndoe@example.com",
                "name": "John Doe 2",
            }
        }))
    })
})