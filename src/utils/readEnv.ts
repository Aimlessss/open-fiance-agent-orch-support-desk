export function readEnv(name : string){
    const rawVal = process.env[name];

    if(!rawVal) throw new Error(`${name} is not in env config please check`);

    return rawVal.trim().replace(/^['"]+|['"]+$/g, "");
}