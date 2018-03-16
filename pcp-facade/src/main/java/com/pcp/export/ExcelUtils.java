package com.pcp.export;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jeecgframework.poi.excel.ExcelExportUtil;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.enmus.ExcelType;
import org.jeecgframework.poi.excel.export.ExcelExportServer;
import org.jeecgframework.poi.util.PoiPublicUtil;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * EXCEL工具类
 *
 * Created by Ning on 2017/8/25.
 */
public class ExcelUtils {

    public static File exportTemplate(Class<?> clazz, String sheetName, String title) {
        ExportParams ep = new ExportParams();
        ep.setStyle(FafaExcelExportStyler.class);
        ep.setSheetName(sheetName);
        ep.setType(ExcelType.XSSF);
        XSSFWorkbook wb = (XSSFWorkbook) ExcelExportUtil.exportExcel(ep, clazz, new ArrayList<Object>());
        Sheet sheet = wb.getSheetAt(0);
        Field fileds[] = PoiPublicUtil.getClassFields(clazz);
        for (int i = 0; i < fileds.length; i++) {
            sheet.autoSizeColumn(i);
        }
        FileOutputStream fos = null;
        File templateFile = null;
        try {
            templateFile = File.createTempFile(title, ".xlsx");
            fos = new FileOutputStream(templateFile);
            wb.write(fos);
            fos.flush();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
//			IOUtils.closeQuietly(fos);
            if (fos != null)
                try {

                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
        return templateFile;
    }

    public static File export(Class<?> clazz, String sheetName, String title, List<?> datas) {
        ExportParams ep = new ExportParams();
        ep.setStyle(FafaExcelExportStyler.class);
        ep.setSheetName(sheetName);
        ep.setType(ExcelType.XSSF);
        Workbook wb = ExcelExportUtil.exportExcel(ep, clazz, datas);
        Sheet sheet = wb.getSheetAt(0);
        Field fileds[] = PoiPublicUtil.getClassFields(clazz);
        for (int i = 0; i < fileds.length; i++) {
            sheet.autoSizeColumn(i);
        }
        FileOutputStream fos = null;
        File templateFile = null;
        try {
            if (wb instanceof XSSFWorkbook) {
                templateFile = File.createTempFile(title, ".xlsx");
            } else {
                templateFile = File.createTempFile(title, ".xls");
            }
            fos = new FileOutputStream(templateFile);
            wb.write(fos);
            fos.flush();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if(fos!=null)
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
        return templateFile;
    }

    public static File export(List<Map<String, Object>> list, String title, String type) {
        Workbook wb;
        if (ExcelType.HSSF.equals(type)) {
            wb = new HSSFWorkbook();
        } else {
            wb = new XSSFWorkbook();
        }

        for (Map<String, Object> map : list) {
            ExportParams ep = new ExportParams();
            ep.setStyle(FafaExcelExportStyler.class);
            ep.setSheetName(map.get("sheetName").toString());
            ep.setType(ExcelType.XSSF);

            ExcelExportServer server = new ExcelExportServer();
            server.createSheet(wb, ep, (Class<?>) map.get("entity"), (Collection<?>) map.get("data"));
        }

		/*Sheet sheet = wb.getSheetAt(0);
        Field fileds[] = PoiPublicUtil.getClassFields(clazz);
		for(int i=0;i<fileds.length;i++){
			sheet.autoSizeColumn(i);
		}*/
        FileOutputStream fos = null;
        File templateFile = null;
        try {
            if (wb instanceof XSSFWorkbook) {
                templateFile = File.createTempFile(title, ".xlsx");
            } else {
                templateFile = File.createTempFile(title, ".xls");
            }
            fos = new FileOutputStream(templateFile);
            wb.write(fos);
            fos.flush();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if(fos!=null)
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
        return templateFile;
    }

}
