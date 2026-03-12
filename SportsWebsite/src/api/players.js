import { searchPlayers } from "./search";

export async function searchPlayerByName(name) {
    return await searchPlayers(name);
}