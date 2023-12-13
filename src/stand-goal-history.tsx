import { useEffect, useState } from "react";
import { Grid } from "@raycast/api";
import { getAllTimers } from "./utils";

interface TimeFormatted {
  content: string;
  key: string;
  keywords: string[];
}

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [timerItems, setTimerItems] = useState<TimeFormatted[]>([]);

  useEffect(() => {
    const timers = getAllTimers();

    const timerFormatted = timers
      .map((t) => {
        const isToday = new Date(t.date).toDateString() === new Date().toDateString();
        let emoji: string;
        if (isToday && !t.goalComplete) {
          emoji = "⏳";
        } else if (!t.goalComplete) {
          emoji = "⬜";
        } else {
          emoji = "🟩";
        }

        return { content: emoji, keywords: [t.date], key: t.date };
      })
      .sort((a, b) => new Date(b.key).getTime() - new Date(a.key).getTime());

    const filteredTimerFormatted = timerFormatted.filter((t) =>
      t.keywords.some((keyword) => keyword.includes(searchText))
    );
    setTimerItems(filteredTimerFormatted);
  }, [searchText]);

  return (
    <Grid
      columns={30}
      inset={Grid.Inset.Large}
      filtering={false}
      onSearchTextChange={setSearchText}
      navigationTitle="Seatch "
      searchBarPlaceholder="Search by date"
    >
      {timerItems.map((item) => (
        <Grid.Item
          key={item.key}
          content={item.content}
          title={new Date(item.key).toLocaleDateString(undefined, {
            weekday: "short",
            day: "2-digit",
            month: "short",
          })}
        />
      ))}
    </Grid>
  );
}
