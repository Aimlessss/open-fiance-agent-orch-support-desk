import { readFile, writeFile } from "node:fs/promises";

type CsvRow = Array<string>;
type JsonPrimitive = string;
type JsonValue = JsonPrimitive | Array<JsonPrimitive>;
type JsonRecord = Record<string, JsonValue>;

async function main(): Promise<void> {
    const [, , inputPath, outputPath = defaultOutputPath(inputPath)] = process.argv;

    if (!inputPath) {
        throw new Error("Usage: npm run csv:to-json -- <input.csv> [output.json]");
    }

    const csv = await readFile(inputPath, "utf8");
    const rows = parseCsv(csv);
    const json = csvRowsToJson(rows);

    await writeFile(outputPath, `${JSON.stringify(json, null, 2)}\n`, "utf8");

    console.log(`Converted ${json.length} rows from ${inputPath} to ${outputPath}`);
}

export function parseCsv(csv: string): Array<CsvRow> {
    const rows: Array<CsvRow> = [];
    let row: CsvRow = [];
    let value = "";
    let insideQuotes = false;

    for (let index = 0; index < csv.length; index += 1) {
        const char = csv[index];
        const nextChar = csv[index + 1];

        if (char === "\"") {
            if (insideQuotes && nextChar === "\"") {
                value += "\"";
                index += 1;
            } else {
                insideQuotes = !insideQuotes;
            }

            continue;
        }

        if (char === "," && !insideQuotes) {
            row.push(cleanCell(value));
            value = "";
            continue;
        }

        if ((char === "\n" || char === "\r") && !insideQuotes) {
            if (char === "\r" && nextChar === "\n") {
                index += 1;
            }

            row.push(cleanCell(value));
            rows.push(row);
            row = [];
            value = "";
            continue;
        }

        value += char;
    }

    if (value.length > 0 || row.length > 0) {
        row.push(cleanCell(value));
        rows.push(row);
    }

    return rows.filter((csvRow) => csvRow.some((cell) => cell.length > 0));
}

export function csvRowsToJson(rows: Array<CsvRow>): Array<JsonRecord> {
    const [rawHeaders, ...dataRows] = rows;

    if (!rawHeaders) {
        return [];
    }

    const headers = rawHeaders.map((header, index) => {
        const cleanHeader = header.trim().replace(/^\uFEFF/, "");

        return cleanHeader.length > 0 ? cleanHeader : `Column ${index + 1}`;
    });

    return dataRows.map((row) => rowToJsonRecord(headers, row));
}

function rowToJsonRecord(headers: Array<string>, row: CsvRow): JsonRecord {
    const record: JsonRecord = {};

    for (let index = 0; index < headers.length; index += 1) {
        const header = headers[index];
        const value = row[index] ?? "";

        if (!header) {
            continue;
        }

        addValue(record, header, value);
    }

    return record;
}

function addValue(record: JsonRecord, key: string, value: string): void {
    const existingValue = record[key];

    if (existingValue === undefined) {
        record[key] = value;
        return;
    }

    if (Array.isArray(existingValue)) {
        if (value.length > 0) {
            existingValue.push(value);
        }

        return;
    }

    record[key] = value.length > 0 ? [existingValue, value] : [existingValue];
}

function cleanCell(value: string): string {
    return value.replace(/^\uFEFF/, "").trim();
}

function defaultOutputPath(inputPath?: string): string {
    if (!inputPath) {
        return "output.json";
    }

    return inputPath.replace(/\.csv$/i, ".json");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
