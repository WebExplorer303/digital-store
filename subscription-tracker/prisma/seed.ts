import { insertProductToDatabase } from '@/lib/db-actions'
import * as fs from 'fs'

async function main() {
    const jsonArray = JSON.parse(fs.readFileSync('../data/mockdata.json', 'utf-8')) 

    for (const item of jsonArray) {
        await insertProductToDatabase(item)
    }
}
main()