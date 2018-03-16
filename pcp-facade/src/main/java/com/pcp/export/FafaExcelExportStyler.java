package com.pcp.export;

import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.jeecgframework.poi.excel.export.styler.AbstractExcelExportStyler;
import org.jeecgframework.poi.excel.export.styler.IExcelExportStyler;


/**
 * Created by Ning on 2017/8/25.
 */
public class FafaExcelExportStyler extends AbstractExcelExportStyler implements IExcelExportStyler {

	private final static XSSFColor KPMG_BLUE_COLOR = new XSSFColor(new byte[] {(byte)0, (byte)51, (byte) 141});

	public FafaExcelExportStyler(Workbook workbook) {
		super.createStyles(workbook);
	}

	@Override
    public CellStyle getHeaderStyle(short headerColor) {
        CellStyle titleStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 24);
        titleStyle.setFont(font);
        titleStyle.setFillForegroundColor(headerColor);
        titleStyle.setAlignment(CellStyle.ALIGN_LEFT);
        titleStyle.setVerticalAlignment(CellStyle.ALIGN_LEFT);
        return titleStyle;
    }

    @Override
    public CellStyle stringNoneStyle(Workbook workbook, boolean isWarp) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderLeft((short) 1); // 左边框
        style.setBorderRight((short) 1); // 右边框
        style.setBorderBottom((short) 1);
        style.setBorderTop((short) 1);
        style.setAlignment(CellStyle.ALIGN_LEFT);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setDataFormat(STRING_FORMAT);
        if (isWarp) {
            style.setWrapText(true);
        }
        return style;
    }

    @Override
    public CellStyle getTitleStyle(short color) {
        XSSFCellStyle titleStyle = (XSSFCellStyle) workbook.createCellStyle();
        titleStyle.setFillForegroundColor(KPMG_BLUE_COLOR); // 填充的背景颜色
        titleStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        titleStyle.setAlignment(CellStyle.ALIGN_LEFT);
        titleStyle.setVerticalAlignment(CellStyle.ALIGN_LEFT);
        titleStyle.setFillPattern(CellStyle.SOLID_FOREGROUND); // 填充图案
        titleStyle.setWrapText(true);
        Font font = workbook.createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 12);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        font.setColor(IndexedColors.WHITE.getIndex());
        titleStyle.setFont(font);
        return titleStyle;
    }

    @Override
    public CellStyle stringSeptailStyle(Workbook workbook, boolean isWarp) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderLeft((short) 1); // 左边框
        style.setBorderRight((short) 1); // 右边框
        style.setBorderBottom((short) 1);
        style.setBorderTop((short) 1);
        style.setFillForegroundColor((short) 41); // 填充的背景颜色
        style.setFillPattern(CellStyle.SOLID_FOREGROUND); // 填充图案
        style.setAlignment(CellStyle.ALIGN_LEFT);
        style.setVerticalAlignment(CellStyle.ALIGN_LEFT);
        style.setDataFormat(STRING_FORMAT);
        if (isWarp) {
            style.setWrapText(true);
        }
        return style;
    }

}