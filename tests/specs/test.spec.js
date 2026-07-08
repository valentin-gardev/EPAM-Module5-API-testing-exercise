import { test, expect } from '@playwright/test'

// expect.soft - if one test fails, it does not stop, it keeps checking until it checks everything
test.skip('Get all products', async({request}) => {
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

test('Get product by valid ID', async({request}) => {

    const apiResponse = await request.get('https://api.practicesoftwaretesting.com/products')

    expect((apiResponse).status()).toBe(200)

    const productData = await apiResponse.json()

    expect(productData).toBeTruthy()
    expect(Array.isArray(productData.data)).toBeTruthy()

    const productID = productData.data[0].id
    // console.log(productID)
    const specifiedItemAPI = await request.get(`https://api.practicesoftwaretesting.com/products/${productID}`)
    expect((specifiedItemAPI).status()).toBe(200)
    
    const testProduct = await specifiedItemAPI.json()
    expect(testProduct).toBeTruthy()
    console.log(testProduct)
    expect(testProduct.id).toBe(productID)

})

test.only('Get product by Invalid ID', async({request}) => {

    const apiResponse = await request.get('https://api.practicesoftwaretesting.com/products/01KX0SKH0G1Z0XPWHADJV6W9E1')// last number is supposed to be 0

    expect((apiResponse).status()).toBe(404)

    const invalidResponse = await apiResponse.json()

    expect(invalidResponse).toBeTruthy()
    expect(invalidResponse.message).toContain('Requested item not found')
})