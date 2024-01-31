import {
    createManyTestPerpustakaan,
    createTestPerpus,
    createTestUser,
    getTestPerpus,
    removeAllTestPerpustakaan,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";

describe('POST /api/perpustakaan', function () {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeAllTestPerpustakaan();
        await removeTestUser();
    })

    it('should can create new book', async () => {
        const result = await supertest(web)
            .post("/api/perpustakaan")
            .set('Authorization', 'test')
            .send({
                title: "test",
                author: "test",
                publication_year: "test",
                genre: "test"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.title).toBe("test");
        expect(result.body.data.author).toBe("test");
        expect(result.body.data.publication_year).toBe("test");
        expect(result.body.data.genre).toBe("test");
    });

    it('should reject if request is not valid', async () => {
        const result = await supertest(web)
            .post("/api/perpustakaan")
            .set('Authorization', 'test')
            .send({
                title: "",
                author: "test",
                publication_year: "1000",
                genre: "0809000000043534534543534534543535345435435"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/perpustakaan/:perpustakaanId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestPerpus();
    })

    afterEach(async () => {
        await removeAllTestPerpustakaan();
        await removeTestUser();
    })

    it('should can get book', async () => {
        const testPerpus = await getTestPerpus();

        const result = await supertest(web)
            .get("/api/perpustakaan/" + testPerpus.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testPerpus.id);
        expect(result.body.data.title).toBe(testPerpus.title);
        expect(result.body.data.author).toBe(testPerpus.author);
        expect(result.body.data.publication_year).toBe(testPerpus.publication_year);
        expect(result.body.data.genre).toBe(testPerpus.genre);
    });

    it('should return 404 if book id is not found', async () => {
        const testPerpus = await getTestPerpus();

        const result = await supertest(web)
            .get("/api/perpustakaan/" + (testPerpus.id + 1))
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('PUT /api/perpustakaan/:perpusId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestPerpus();
    })

    afterEach(async () => {
        await removeAllTestPerpustakaan();
        await removeTestUser();
    })

    it('should can update existing book', async () => {
        const testPerpus = await getTestPerpus();

        const result = await supertest(web)
            .put('/api/perpustakaan/' + testPerpus.id)
            .set('Authorization', 'test')
            .send({
                title: "Legenda Seluler",
                author: "Moonton",
                publication_year: "2015",
                genre: "Komedi"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testPerpus.id);
        expect(result.body.data.title).toBe("Legenda Seluler");
        expect(result.body.data.author).toBe("Moonton");
        expect(result.body.data.publication_year).toBe("2015");
        expect(result.body.data.genre).toBe("Komedi");
    });

    it('should reject if request is invalid', async () => {
        const testPerpus = await getTestPerpus();

        const result = await supertest(web)
            .put('/api/perpustakaan/' + testPerpus.id)
            .set('Authorization', 'test')
            .send({
                title: "",
                author: "",
                publication_year: "1000",
                genre: ""
            });

        expect(result.status).toBe(400);
    });

    it('should reject if book is not found', async () => {
        const testPerpus = await getTestPerpus();

        const result = await supertest(web)
            .put('/api/perpustakaan/' + (testPerpus.id + 1))
            .set('Authorization', 'test')
            .send({
                title: "Legenda Seluler",
                author: "Moonton",
                publication_year: "2015",
                genre: "Komedi"
            });

        expect(result.status).toBe(404);
    });
});

describe('DELETE /api/perpustakaan/:perpusId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestPerpus();
    })

    afterEach(async () => {
        await removeAllTestPerpustakaan();
        await removeTestUser();
    })

    it('should can delete contact', async () => {
        let testPerpus = await getTestPerpus();
        const result = await supertest(web)
            .delete('/api/perpustakaan/' + testPerpus.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        testPerpus = await getTestPerpus();
        expect(testPerpus).toBeNull();
    });

    it('should reject if book is not found', async () => {
        let testPerpus = await getTestPerpus();
        const result = await supertest(web)
            .delete('/api/perpustakaan/' + (testPerpus.id + 1))
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('GET /api/perpustakaan', function () {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestPerpustakaan();
    })

    afterEach(async () => {
        await removeAllTestPerpustakaan();
        await removeTestUser();
    })

    it('should can search without parameter', async () => {
        const result = await supertest(web)
            .get('/api/perpustakaan')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search to page 2', async () => {
        const result = await supertest(web)
            .get('/api/perpustakaan')
            .query({
                page:2
            })
            .set('Authorization', 'test');
        
        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search using title', async () => {
        const result = await supertest(web)
            .get('/api/perpustakaan')
            .query({
                title: "test1"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using author', async () => {
        const result = await supertest(web)
            .get('/api/perpustakaan')
            .query({
                author: "test1"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using publication_year', async () => {
        const result = await supertest(web)
            .get('/api/perpustakaan')
            .query({
                publication_year: "test1"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using genre', async () => {
        const result = await supertest(web)
            .get('/api/perpustakaan')
            .query({
                genre: "test1"
            })
            .set('Authorization', 'test');

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

});
