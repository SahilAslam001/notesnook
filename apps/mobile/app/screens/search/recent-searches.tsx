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

import { strings } from "@notesnook/intl";
import { useThemeColors } from "@notesnook/theme";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { IconButton } from "../../components/ui/icon-button";
import {
  RecentSearch,
  recentSearchesService
} from "../../services/recent-searches";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";

interface RecentSearchesProps {
  onSearchSelect: (query: string) => void;
}

export const RecentSearches = ({ onSearchSelect }: RecentSearchesProps) => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const { colors } = useThemeColors();

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    const searches = await recentSearchesService.getRecentSearches();
    setRecentSearches(searches);
  };

  const handleDeleteSearch = async (query: string) => {
    await recentSearchesService.deleteSearch(query);
    await loadRecentSearches();
  };

  const handleClearAll = async () => {
    await recentSearchesService.clearAllSearches();
    setRecentSearches([]);
  };

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: DefaultAppStyles.GAP
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: DefaultAppStyles.GAP_SMALL,
          paddingHorizontal: DefaultAppStyles.GAP_SMALL
        }}
      >
        <Text
          style={{
            fontSize: AppFontSize.sm,
            color: colors.primary.heading,
            fontFamily: "Inter-SemiBold"
          }}
        >
          {strings.recentSearches()}
        </Text>
        <Pressable
          onPress={handleClearAll}
          style={{
            paddingHorizontal: DefaultAppStyles.GAP_SMALL,
            paddingVertical: 5
          }}
        >
          <Text
            style={{
              fontSize: AppFontSize.xs,
              color: colors.primary.accent,
              fontFamily: "Inter-Medium"
            }}
          >
            {strings.clearAll()}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: DefaultAppStyles.GAP }}
      >
        {recentSearches.map((search, index) => (
          <Pressable
            key={`${search.query}-${index}`}
            onPress={() => onSearchSelect(search.query)}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: DefaultAppStyles.GAP_SMALL,
              paddingHorizontal: DefaultAppStyles.GAP_SMALL,
              borderRadius: 5,
              backgroundColor: pressed
                ? colors.secondary.background
                : "transparent"
            })}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1
              }}
            >
              <IconButton
                name="clock-outline"
                size={AppFontSize.lg}
                color={colors.secondary.icon}
                type="plain"
                style={{ marginRight: DefaultAppStyles.GAP_SMALL }}
              />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: AppFontSize.sm,
                  color: colors.primary.paragraph,
                  fontFamily: "Inter-Regular",
                  flex: 1
                }}
              >
                {search.query}
              </Text>
            </View>

            <IconButton
              name="close"
              size={AppFontSize.lg}
              onPress={() => handleDeleteSearch(search.query)}
              color={colors.secondary.icon}
              type="plain"
              testID={`delete-recent-search-${index}`}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
