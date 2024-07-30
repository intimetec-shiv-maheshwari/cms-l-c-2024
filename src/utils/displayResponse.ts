async function viewResponse(response: any) {
    if (response.length === 0) {
      console.log("No data to display.");
    }

    const keys = Object.keys(response[0]);
    const columnWidths = keys.map((key) =>
      Math.max(
        ...response.map((obj: { [x: string]: any }) => String(obj[key]).length),
        key.length
      )
    );

    const separatorLine =
      "+" + columnWidths.map((width) => "-".repeat(width + 2)).join("+") + "+";

    const header =
      "| " +
      keys.map((key, i) => key.padEnd(columnWidths[i])).join(" | ") +
      " |";

    console.log(separatorLine);
    console.log(header);
    console.log(separatorLine);

    response.forEach((obj: { [x: string]: any }) => {
      const row =
        "| " +
        keys
          .map((key, i) => String(obj[key]).padEnd(columnWidths[i]))
          .join(" | ") +
        " |";
      console.log(row);
    });

    console.log(separatorLine);
  }

export default viewResponse ;