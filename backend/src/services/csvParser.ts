import { parse } from "csv-parse/sync";
import * as iconv from "iconv-lite";

export function parseCsv(buffer: Buffer, encoding: string = "gbk") {
  // Decode the buffer from GBK (typical for Alipay/WeChat imports in China) to UTF-8 string
  const content = iconv.decode(buffer, encoding);

  // Parse the generic CSV content
  const records = parse(content, {
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  });

  return records;
}
