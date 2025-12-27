import { httpPromise } from "../../common/api"
import * as fs from 'fs';
import { API_BASE_URL } from "../../constants";

type TODO = {
    id?: number,
    userId: number,
    title: string
    completed: boolean
}

const getTODO = async (id = 200) => {
    const result: TODO = await httpPromise(`${API_BASE_URL}/${id}`)

    const resultString = JSON.stringify(result, null, 2)

    const fileName = `./result-${id}.json`

    fs.writeFileSync(fileName, resultString, "utf-8")
}


const createNewToDo = async () => {
    const data: TODO = {
        userId: 1,
        title: "This is my 1st TODO",
        completed: false
    }

    const result: TODO = await httpPromise(
        API_BASE_URL,
        "POST",
        data as any
    )

    data.id = result.id

    const fileName = `./result-${data.id}.json`

    const resultString = JSON.stringify(data, null, 2)


    console.log('resultString', data);

    fs.writeFileSync(fileName, resultString, "utf-8")
}

getTODO()

const main = async () => {
    await getTODO()
    await createNewToDo()
}

main().catch(console.error)
