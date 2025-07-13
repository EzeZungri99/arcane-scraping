import { chromium, Browser, Page } from 'playwright';
import { config } from '../../config/config';
import { LoginService } from '../../utils/doLogin';
import { LoginResult } from '../../types/login';

export class PlaywrightService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private loginService: LoginService | null = null;
  private isLoggedIn: boolean = false;

  async runAutomation(): Promise<any> {
    try {
      console.log('🚀 Iniciando automatización con Playwright...');
      
      await this.initializeBrowser();
      
      const loginResult = await this.performLoginStep();
      
      if (!loginResult.success) {
        throw new Error(`Login fallido: ${loginResult.error}`);
      }
      
      this.isLoggedIn = true;
      console.log('✅ PASO 1 completado: El monje ha entrado a la cripta');
      console.log('🌐 Navegador mantenido abierto para próximos pasos...');
      
      return {
        success: true,
        message: 'PASO 1 completado - Login exitoso. Navegador listo para próximos pasos.',
        data: {
          step: 'PASO 1: EL RITUAL DE ENTRADA',
          status: 'COMPLETADO',
          loginResult,
          browserOpen: true,
          readyForNextStep: true
        }
      };
      
    } catch (error) {
      console.error('❌ Error en automatización:', error);
      throw error;
    }
  }

  private async initializeBrowser(): Promise<void> {
    console.log('🌐 Inicializando navegador...');
    
    this.browser = await chromium.launch({
      headless: config.browser.headless,
      slowMo: config.browser.slowMo
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    if (this.page) {
      this.loginService = new LoginService(this.page);
    }
    
    console.log('✅ Navegador inicializado');
  }

  private async performLoginStep(): Promise<LoginResult> {
    if (!this.page || !this.loginService) {
      throw new Error('Servicios no inicializados');
    }

    try {
      console.log('🗝️ PASO 1: EL RITUAL DE ENTRADA');
      console.log('🚪 Abriendo la Cueva Sagrada...');
      
      await this.page.goto(config.url);
      await this.page.waitForLoadState('networkidle');
      
      const loginResult = await this.loginService.performLogin();
      
      if (loginResult.success) {
        console.log('✅ Login exitoso - El monje ha entrado a la cripta');
      } else {
        console.log('❌ Login fallido:', loginResult.error);
      }
      
      return loginResult;
      
    } catch (error) {
      console.error('❌ Error durante el ritual de entrada:', error);
      
      return {
        success: false,
        message: 'Error durante el ritual de entrada',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  private async findCenturyBlockByIndex(century: string, index: number): Promise<any> {
    if (!this.page) throw new Error('Página no inicializada');
    
    const blocks = await this.page.locator('*:has(span.text-sm)').all();
    let count = 0;
    
    for (const block of blocks) {
      try {
        const span = await block.locator('span.text-sm').first();
        const text = await span.textContent();
        if (text && text.trim() === `Siglo ${century}`) {
          count++;
          if (count === index) {
            console.log(`✅ Encontrado el bloque #${index} del siglo ${century}`);
            return block;
          }
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  }

  async filterByCentury(century: string): Promise<any> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Navegador no inicializado o no logueado');
    }

    try {
      console.log(`🔍 Buscando siglo: ${century}`);
      
      const centuryBlock = await this.findCenturyBlockByIndex(century, 1); // Assuming index 1 for filtering
      
      if (centuryBlock) {
        console.log(`✅ Siglo ${century} encontrado y seleccionado`);
        await this.page.waitForTimeout(2000);
        
        return {
          success: true,
          message: `Siglo ${century} seleccionado exitosamente`,
          block: centuryBlock
        };
      } else {
        console.log(`❌ No se encontró elemento span que contenga exactamente el siglo ${century}`);
        return {
          success: false,
          message: `No se encontró elemento del siglo ${century}`
        };
      }
      
    } catch (error) {
      console.error('❌ Error al buscar siglo:', error);
      throw error;
    }
  }

  async downloadPDF(century: string, index: number = 1): Promise<any> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Navegador no inicializado o no logueado');
    }

    try {
      console.log(`📥 Descargando PDF del siglo: ${century} (bloque #${index})`);
      
      const fs = require('fs');
      const path = require('path');
      const manuscriptsDir = path.join(__dirname, '../../../manuscripts');
      const pdfPath = path.join(manuscriptsDir, `${century}.pdf`);
      
      if (fs.existsSync(pdfPath)) {
        console.log(`✅ PDF del siglo ${century} ya existe: ${pdfPath}`);
        return {
          success: true,
          message: `PDF del siglo ${century} ya existe`,
          filePath: pdfPath,
          alreadyExists: true
        };
      }
      
      const centuryBlock = await this.findCenturyBlockByIndex(century, index);
      if (!centuryBlock) {
        throw new Error(`No se encontró bloque #${index} del siglo ${century}`);
      }
      
      const downloadSelectors = [
        'text="Descargar PDF"',
        'text="Descargar"',
        'button:has-text("PDF")',
        'button:has-text("Descargar")',
        '[role="button"]:has-text("PDF")',
        '[role="button"]:has-text("Descargar")'
      ];
      
      let downloadButton = null;
      
      for (const selector of downloadSelectors) {
        try {
          const button = await centuryBlock.locator(selector).first();
          if (await button.isVisible()) {
            downloadButton = button;
            console.log(`✅ Encontrado botón de descarga con selector: ${selector}`);
            break;
          }
        } catch (e) {
          console.log(`⚠️ Selector no encontrado: ${selector}`);
        }
      }
      
      if (downloadButton) {
        const downloadPromise = this.page.waitForEvent('download');
        await downloadButton.click();
        
        const download = await downloadPromise;
        
        if (!fs.existsSync(manuscriptsDir)) {
          fs.mkdirSync(manuscriptsDir, { recursive: true });
        }
        
        await download.saveAs(pdfPath);
        
        console.log(`✅ PDF descargado: ${pdfPath}`);
        
        console.log('⏳ Esperando 4 segundos para que el archivo se guarde completamente...');
        await new Promise(resolve => setTimeout(resolve, 4000));
        console.log('✅ Delay completado, archivo listo para procesar');
        
        return {
          success: true,
          message: `PDF del siglo ${century} descargado exitosamente`,
          filePath: pdfPath,
          alreadyExists: false
        };
      } else {
        console.log('❌ No se encontró botón de descarga con ningún selector');
        console.log('🔍 Elementos disponibles en el bloque:');
        
        const allButtons = await centuryBlock.locator('button, [role="button"], a').all();
        for (const button of allButtons) {
          const text = await button.textContent();
          console.log(`📄 Botón: "${text}"`);
        }
        
        throw new Error('No se encontró botón de descarga');
      }
    } catch (error) {
      console.error('❌ Error al descargar PDF:', error);
      throw error;
    }
  }

  async unlockCentury(century: string, code: string, index: number = 1): Promise<any> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Navegador no inicializado o no logueado');
    }

    try {
      console.log(`🔓 Desbloqueando siglo ${century} (bloque #${index}) con código: ${code}`);
      const centuryBlock = await this.findCenturyBlockByIndex(century, index);
      if (!centuryBlock) {
        throw new Error(`No se encontró bloque #${index} del siglo ${century}`);
      }

      const codeInput = await centuryBlock.locator('input[type="text"], input[placeholder*="código"]').first();
      if (await codeInput.isVisible()) {
        await codeInput.fill(code);
        console.log(`✅ Código ingresado: ${code}`);

        // Buscar el botón de desbloqueo SOLO dentro del bloque correcto
        const unlockButton = await centuryBlock.locator('button:has-text("Desbloquear"), button:has-text("Unlock")').first();
        if (await unlockButton.isVisible()) {
          await unlockButton.click();
          console.log('✅ Botón de desbloqueo clickeado');
          await this.page.waitForTimeout(2000);
          return { success: true, message: `Siglo ${century} desbloqueado exitosamente con código: ${code}` };
        } else {
          throw new Error('No se encontró botón de desbloqueo');
        }
      } else {
        throw new Error('No se encontró campo de código en el bloque del siglo correcto');
      }
    } catch (error) {
      console.error('❌ Error al desbloquear siglo:', error);
      throw error;
    }
  }

  async extractCodeFromPDF(century: string): Promise<any> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Navegador no inicializado o no logueado');
    }

    try {
      console.log(`📖 Extrayendo código del PDF del siglo ${century}...`);
      
      const pdfParse = require('pdf-parse');
      const fs = require('fs');
      const path = require('path');
      
      const manuscriptsDir = path.join(__dirname, '../../../manuscripts');
      const pdfPath = path.join(manuscriptsDir, `${century}.pdf`);
      
      if (!fs.existsSync(pdfPath)) {
        throw new Error(`No se encontró el archivo PDF: ${pdfPath}`);
      }

      console.log('⏳ Esperando 2 segundos adicionales para asegurar disponibilidad del archivo...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Archivo listo para procesar');

      console.log(`📄 Leyendo PDF: ${pdfPath}`);
      
      try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(dataBuffer);
        
        console.log('📄 Procesando PDF...');
        console.log('📄 Texto extraído:');
        console.log(pdfData.text);
        
        const codePattern = /Código de acceso:\s*([A-Z0-9_]+)/i;
        const match = pdfData.text.match(codePattern);
        
        if (match) {
          const extractedCode = match[1];
          console.log(`✅ Código extraído exitosamente: ${extractedCode}`);
          
          return {
            success: true,
            message: `Código extraído del siglo ${century}: ${extractedCode}`,
            code: extractedCode
          };
        }
        
        const alternativePatterns = [
          /\b[A-Z]{2,}\d{4}\b/,  
          /\b[A-Z0-9_]{4,}\b/,   
          /\b[A-Z]{2,}[0-9]{2,}\b/, 
          /código[:\s]*([A-Z0-9]+)/i 
        ];
        
        for (const pattern of alternativePatterns) {
          const match = pdfData.text.match(pattern);
          if (match) {
            const extractedCode = match[1] || match[0];
            console.log(`✅ Código encontrado con patrón alternativo: ${extractedCode}`);
            
            return {
              success: true,
              message: `Código extraído del siglo ${century}: ${extractedCode}`,
              code: extractedCode
            };
          }
        }
        
        console.log('❌ No se encontró código en el PDF');
        console.log('📄 Texto completo para debug:');
        console.log(pdfData.text);
        
        return {
          success: false,
          message: 'No se encontró código en el PDF',
          text: pdfData.text
        };
        
      } catch (pdfError: any) {
        console.log('❌ Error al procesar PDF con pdf-parse:', pdfError.message);
        
        try {
          const textContent = fs.readFileSync(pdfPath, 'utf8');
          console.log('📄 Intentando leer como texto plano...');
          console.log('📄 Contenido del archivo:');
          console.log(textContent);
          
          const codePattern = /Código de acceso:\s*([A-Z0-9_]+)/i;
          const match = textContent.match(codePattern);
          
          if (match) {
            const extractedCode = match[1];
            console.log(`✅ Código extraído del texto plano: ${extractedCode}`);
            
            return {
              success: true,
              message: `Código extraído del siglo ${century}: ${extractedCode}`,
              code: extractedCode
            };
          }
          
          return {
            success: false,
            message: 'No se pudo extraer código del PDF',
            error: pdfError.message
          };
          
        } catch (textError: any) {
          console.log('❌ Error al leer archivo como texto:', textError.message);
          return {
            success: false,
            message: 'Error al procesar el archivo PDF',
            error: pdfError.message
          };
        }
      }
    } catch (error) {
      console.error('❌ Error al extraer código del PDF:', error);
      throw error;
    }
  }

  getStatus(): any {
    return {
      browserRunning: this.browser !== null,
      pageOpen: this.page !== null,
      isLoggedIn: this.isLoggedIn,
      readyForNextStep: this.isLoggedIn && this.browser !== null && this.page !== null
    };
  }

  async processSpecificCentury(century: string): Promise<any> {
    try {
      console.log(`📜 Procesando siglo específico: ${century}`);
      
      const previousCentury = this.getPreviousCentury(century);
      if (previousCentury) {
        console.log(`🔍 Extrayendo código del siglo anterior: ${previousCentury}`);
        const extractResult = await this.extractCodeFromPDF(previousCentury);
        
        if (extractResult.success && extractResult.code) {
          console.log(`🔓 Desbloqueando siglo ${century} con código: ${extractResult.code}`);
          await this.unlockCentury(previousCentury, extractResult.code);
        }
      }
      
      console.log(`🔍 Filtrando por siglo: ${century}`);
      await this.filterByCentury(century);
      
      console.log(`📥 Descargando PDF del siglo: ${century}`);
      await this.downloadPDF(century);
      
      return {
        success: true,
        message: `Siglo ${century} procesado exitosamente`,
        century: century
      };
      
    } catch (error) {
      console.error(`❌ Error procesando siglo ${century}:`, error);
      throw error;
    }
  }

  async runCompleteFlow(): Promise<any> {
    try {
      console.log('🔄 Iniciando flujo completo para los primeros 3 tomos...');
      
      if (!this.isLoggedIn || !this.browser || !this.page) {
        console.log('🔐 Iniciando proceso de login...');
        await this.runAutomation();
        console.log('✅ Login completado, continuando con el flujo...');
      }
      
      const centuryIndexMap: { [key: string]: number } = { 'XIV': 1, 'XV': 2, 'XVI': 3 };
      const centuries = ['XIV', 'XV', 'XVI'];
      const results = [];
      
      for (const century of centuries) {
        const index = centuryIndexMap[century] || 1;
        console.log(`\n📜 Procesando siglo: ${century} (bloque #${index})`);
        
        if (century === 'XIV') {
          console.log('🔍 Filtrando por siglo XIV...');
          await this.filterByCentury(century);
          
          console.log('📥 Descargando PDF del siglo XIV...');
          await this.downloadPDF(century, index);
          
          console.log('⏳ Esperando 4 segundos para que el archivo se guarde...');
          await new Promise(resolve => setTimeout(resolve, 4000));
          
          console.log('🔍 Extrayendo código del siglo XIV...');
          const extractResult = await this.extractCodeFromPDF(century);
          results.push({ century, extractResult });
          
        } else {
          const previousCentury = this.getPreviousCentury(century);
          const previousIndex = centuryIndexMap[previousCentury || ''] || 1;
          if (previousCentury) {
            console.log(`🔍 Extrayendo código del siglo anterior: ${previousCentury}`);
            const extractResult = await this.extractCodeFromPDF(previousCentury);
            
            if (extractResult.success && extractResult.code) {
              console.log(`🔓 Desbloqueando siglo ${century} con código: ${extractResult.code}`);
              await this.unlockCentury(century, extractResult.code, index);
              
              console.log(`🔍 Filtrando por siglo: ${century}`);
              await this.filterByCentury(century);
              
              console.log(`📥 Descargando PDF del siglo: ${century}`);
              await this.downloadPDF(century, index);
              
              console.log('⏳ Esperando 4 segundos para que el archivo se guarde...');
              await new Promise(resolve => setTimeout(resolve, 4000));
              
              console.log(`🔍 Extrayendo código del siglo: ${century}`);
              const currentExtractResult = await this.extractCodeFromPDF(century);
              results.push({ century, extractResult: currentExtractResult });
            } else {
              console.log(`❌ No se pudo extraer código del siglo ${previousCentury}`);
              results.push({ century, error: 'No se pudo extraer código del siglo anterior' });
            }
          } else {
            console.log(`❌ No se encontró siglo anterior para ${century}`);
            results.push({ century, error: 'No se encontró siglo anterior' });
          }
        }
        
        console.log(`✅ Siglo ${century} completado`);
      }
      
      console.log('🎉 Flujo completo finalizado exitosamente');
      
      return {
        success: true,
        message: 'Flujo completo ejecutado exitosamente',
        results: results
      };
      
    } catch (error) {
      console.error('❌ Error en flujo completo:', error);
      throw error;
    }
  }

  private getPreviousCentury(century: string): string | null {
    const centuryMap: { [key: string]: string } = {
      'XV': 'XIV',
      'XVI': 'XV',
      'XVII': 'XVI',
      'XVIII': 'XVII'
    };
    
    return centuryMap[century] || null;
  }

} 