import { readFile } from "node:fs/promises";
import { TEngineerRoutingProfile } from "../dto";

const profileStartPattern = /^\s*\d+\.\s+(.+?)\s+(?:\u2014|-)\s+(\S+@\S+)\s*$/;
const fieldLabels = ["Ticket Count", "Expertise", "Route when"];

export async function loadEngineerProfilesFromMarkdown(
    filePath: string
): Promise<Array<TEngineerRoutingProfile>> {
    const markdown = await readFile(filePath, "utf8");

    return parseEngineerProfilesFromMarkdown(markdown);
}

export function parseEngineerProfilesFromMarkdown(
    markdown: string
): Array<TEngineerRoutingProfile> {
    const lines = markdown.split(/\r?\n/);
    const profileSections: Array<Array<string>> = [];
    let currentSection: Array<string> = [];

    for (const line of lines) {
        if (profileStartPattern.test(line)) {
            if (currentSection.length > 0) {
                profileSections.push(currentSection);
            }

            currentSection = [line];
            continue;
        }

        if (currentSection.length > 0) {
            currentSection.push(line);
        }
    }

    if (currentSection.length > 0) {
        profileSections.push(currentSection);
    }

    return profileSections.map(parseEngineerProfileSection);
}

function parseEngineerProfileSection(lines: Array<string>): TEngineerRoutingProfile {
    const heading = lines[0];
    const headingMatch = heading?.match(profileStartPattern);

    if (!headingMatch) {
        throw new Error(`Invalid engineer profile heading: ${heading ?? ""}`);
    }

    const [, name, email] = headingMatch;

    if (!name || !email) {
        throw new Error(`Engineer profile heading is missing name or email: ${heading}`);
    }

    const profile: TEngineerRoutingProfile = {
        name: name.trim(),
        email: email.trim(),
        expertise: requireField(lines, "Expertise", name),
        routeWhen: requireField(lines, "Route when", name),
    };
    const ticketCount = readField(lines, "Ticket Count");

    if (ticketCount) {
        profile.ticketCount = ticketCount;
    }

    return profile;
}

function requireField(
    lines: Array<string>,
    label: string,
    engineerName: string
): string {
    const value = readField(lines, label);

    if (!value) {
        throw new Error(`Missing "${label}" for engineer profile: ${engineerName}`);
    }

    return value;
}

function readField(lines: Array<string>, label: string): string | undefined {
    const fieldStartIndex = lines.findIndex((line) => line.startsWith(`${label}:`));

    if (fieldStartIndex === -1) {
        return undefined;
    }

    const fieldParts = [
        lines[fieldStartIndex]?.slice(label.length + 1).trim() ?? "",
    ];

    for (let index = fieldStartIndex + 1; index < lines.length; index += 1) {
        const line = lines[index];

        if (!line || isKnownFieldLine(line)) {
            break;
        }

        fieldParts.push(line.trim());
    }

    const value = fieldParts.join(" ").trim();

    return value.length > 0 ? value : undefined;
}

function isKnownFieldLine(line: string): boolean {
    return fieldLabels.some((label) => line.startsWith(`${label}:`));
}
