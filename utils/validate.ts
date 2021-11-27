const verifyFields = (data: any, fields: Array<string>) => {

    fields?.forEach(field => {
        if (typeof data == 'object') {
            if (!data?.hasOwnProperty(field?.toString()))
                throw new Error(`Informe o campo ${field}`)

            if (data[field.toString()] === undefined || data[field?.toString()] === null)
                throw new Error(`Informe o campo ${field}`)
        } else {
            if (data === undefined || data === null)
                throw new Error(`Informe o campo ${field}`)
        }
    })
}

export { verifyFields }