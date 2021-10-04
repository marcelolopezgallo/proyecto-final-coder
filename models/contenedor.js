const fs = require('fs')
const moment = require('moment')

class Contenedor {
    constructor(filename) {
        this.filename = filename
        if (! fs.existsSync(this.filename)) {
            fs.writeFileSync(this.filename, JSON.stringify([]))
        }
    }

    async create(product) {
        const contenido = await this.getAll()

        if (contenido.length == 0) {
            product.id = 1
        } else {
            product.id = contenido[contenido.length - 1].id + 1
        }

        product.timestamp = moment().unix()
        contenido.push(product)

        await fs.promises.writeFile(this.filename, JSON.stringify(contenido))

        return product
    }

    async update(id, newObject) {
        const contenido = await this.getAll()

        const index = contenido.findIndex(p => p.id == id)

        if (index !== -1) {
            let keys = Object.keys(newObject)
            keys.map(x=>{
                contenido[index][x] = newObject[x]
            })
        } else {
            throw Error('-1')
        }

        await fs.promises.writeFile(this.filename, JSON.stringify(contenido))
    }

    async getById(id) {
        const contenido = await this.getAll()

        const filteredProduct = contenido.filter(producto => producto.id == id)

        if (filteredProduct.length !== 0) {
            return filteredProduct[0]
        } else {
            throw Error('-1')
        }
    }

    async getAll() {
        try {
            const contenido = await fs.promises.readFile(this.filename, 'utf-8')
            return JSON.parse(contenido)
        } catch (err) {
            throw new Error(`Error al abrir el archivo: ${err}`)
        }
    }

    async deleteById(id) {
        const contenido = await this.getAll()
        const filteredProduct = contenido.filter(producto => producto['id'] == id)
        
        if (filteredProduct.length !== 0) {
            await fs.promises.writeFile(this.filename, JSON.stringify(contenido.filter(element => element.id != id)))
        } else {
            throw Error('-1')
        }
    }

    async deleteAll() {
        await fs.promises.writeFile(this.filename, JSON.stringify([])) //borro todos los elementos
    }

    async addCartProduct(cartId, productData){
        const contenido = await this.getAll()
        const filteredCarts = contenido.filter(cart => cart['id'] == cartId)
        
        if (filteredCarts.length !== 0) {
            filteredCarts[0].products.push(productData)
            
            await fs.promises.writeFile(this.filename, JSON.stringify(contenido))
        } else {
            throw Error('-1')
        } 
    }

    async deleteCartProductById(cartId, pid){
        const carritos = await this.getAll()
        const filteredCart = carritos.filter(cart => cart['id'] == cartId)
        
        if (filteredCart.length !== 0) {
            filteredCart[0].products.forEach((element, index, object) => {
                if(element.id == pid) {
                    object.splice(index,1)
                }
            })
            await fs.promises.writeFile(this.filename, JSON.stringify(carritos))
            return carritos
        } else {
            throw Error('-1')
        } 
    }
}

module.exports = Contenedor