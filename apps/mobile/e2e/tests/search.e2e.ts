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

import { TestBuilder } from "./utils";

describe("Search", () => {
  it("Search for a note", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .waitAndTapById("search-header")
      .typeTextById("search-input", "Test")
      .wait(1000)
      .isVisibleByText("1")
      .waitAndTapById("clear-search")
      .wait(2000)
      .isNotVisibleByText("1")
      .run();
  });

  it("Recent searches - save, display, and select", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .waitAndTapById("search-header")
      .typeTextById("search-input", "FirstSearch")
      .wait(1000)
      .tapReturnKeyById("search-input")
      .wait(500)
      .waitAndTapById("clear-search")
      .wait(500)
      .typeTextById("search-input", "SecondSearch")
      .wait(1000)
      .tapReturnKeyById("search-input")
      .wait(500)
      .waitAndTapById("clear-search")
      .wait(1000)
      .isVisibleByText("Recent searches")
      .isVisibleByText("SecondSearch")
      .isVisibleByText("FirstSearch")
      .run();
  });

  it("Recent searches - delete individual search", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .waitAndTapById("search-header")
      .typeTextById("search-input", "TestQuery")
      .wait(1000)
      .tapReturnKeyById("search-input")
      .wait(500)
      .waitAndTapById("clear-search")
      .wait(1000)
      .isVisibleByText("TestQuery")
      .waitAndTapById("delete-recent-search-0")
      .wait(500)
      .isNotVisibleByText("TestQuery")
      .run();
  });

  it("Recent searches - clear all", async () => {
    await TestBuilder.create()
      .prepare()
      .createNote()
      .waitAndTapById("search-header")
      .typeTextById("search-input", "Query1")
      .wait(1000)
      .tapReturnKeyById("search-input")
      .wait(500)
      .waitAndTapById("clear-search")
      .wait(500)
      .typeTextById("search-input", "Query2")
      .wait(1000)
      .tapReturnKeyById("search-input")
      .wait(500)
      .waitAndTapById("clear-search")
      .wait(1000)
      .isVisibleByText("Recent searches")
      .waitAndTapByText("Clear all")
      .wait(500)
      .isNotVisibleByText("Recent searches")
      .run();
  });
});
