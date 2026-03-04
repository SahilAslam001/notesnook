/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { MMKV } from "../common/database/mmkv";

const RECENT_SEARCHES_KEY = "recentSearches";
const MAX_RECENT_SEARCHES = 10;

export interface RecentSearch {
  query: string;
  timestamp: number;
}

export class RecentSearchesService {
  private static instance: RecentSearchesService;

  private constructor() {}

  static getInstance(): RecentSearchesService {
    if (!RecentSearchesService.instance) {
      RecentSearchesService.instance = new RecentSearchesService();
    }
    return RecentSearchesService.instance;
  }

  async getRecentSearches(): Promise<RecentSearch[]> {
    try {
      const data = MMKV.getString(RECENT_SEARCHES_KEY);
      if (!data) return [];
      return JSON.parse(data) as RecentSearch[];
    } catch (e) {
      console.error("Error reading recent searches:", e);
      return [];
    }
  }

  async saveSearch(query: string): Promise<void> {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      const recentSearches = await this.getRecentSearches();

      const filtered = recentSearches.filter(
        (search) => search.query.toLowerCase() !== trimmedQuery.toLowerCase()
      );

      const updated: RecentSearch[] = [
        { query: trimmedQuery, timestamp: Date.now() },
        ...filtered
      ];

      const limited = updated.slice(0, MAX_RECENT_SEARCHES);

      MMKV.setString(RECENT_SEARCHES_KEY, JSON.stringify(limited));
    } catch (e) {
      console.error("Error saving recent search:", e);
    }
  }

  async deleteSearch(query: string): Promise<void> {
    try {
      const recentSearches = await this.getRecentSearches();
      const filtered = recentSearches.filter(
        (search) => search.query !== query
      );
      MMKV.setString(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error("Error deleting recent search:", e);
    }
  }

  async clearAllSearches(): Promise<void> {
    try {
      MMKV.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error("Error clearing recent searches:", e);
    }
  }
}

export const recentSearchesService = RecentSearchesService.getInstance();
