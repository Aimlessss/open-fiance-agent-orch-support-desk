import { loadEngineerProfilesFromMarkdown } from "./routing/load-engineer-profiles";

async function main() {
    const data = await loadEngineerProfilesFromMarkdown('src/people');
    console.log(data);
}

main();
