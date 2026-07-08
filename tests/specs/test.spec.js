import { test, expect } from '@playwright/test'

// expect.soft - if one test fails, it does not stop, it keeps checking until it checks everything
test('Get all products', async({request}) => {
    // send a get request
    // check response status
    // validate the response body contains product data
    const apiResponse = await request.get('https://api.practicesoftwaretesting.com/products')
    
    expect(apiResponse.status()).toBe(200)// to be exactly this code
    expect(apiResponse.ok()).toBeTruthy();// returns status of response(true or false)
    
    const userDataBuffer = await apiResponse.body()
    const userData = JSON.parse(userDataBuffer.toString('utf-8'))
    // short version const userData = await apiResponse.json()

    expect(userData).toBeTruthy()
    expect(Array.isArray(userData.data)).toBeTruthy()

    for(const product of userData.data) {
        expect.soft(product).toHaveProperty('id')
        expect.soft(product).toHaveProperty('name')
        expect.soft(product).toHaveProperty('price')
        expect.soft(product).toHaveProperty('category')
    }
})

