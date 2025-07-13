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
    
    console.log(`🔍 Buscando "Siglo ${century}" en posición visual ${index}...`);
    
    // Buscar específicamente en los divs que contienen los siglos
    const blocks = await this.page.locator('div.space-y-3 > div').all();
    console.log(`📄 Total de bloques encontrados: ${blocks.length}`);
    
    for (let i = 0; i < blocks.length; i++) {
      try {
        const span = await blocks[i].locator('span.text-sm').first();
        const text = await span.textContent();
        console.log(`🔍 Bloque ${i + 1}: "${text}"`);
        
        if (text && text.trim() === `Siglo ${century}`) {
          console.log(`✅ Encontrado "Siglo ${century}" en posición ${i + 1}`);
          
          // Si estamos buscando la posición específica (index)
          if (i + 1 === index) {
            console.log(`✅ Seleccionando bloque en posición ${index} que contiene "Siglo ${century}"`);
            return blocks[i];
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    console.log(`❌ No se encontró "Siglo ${century}" en la posición ${index}`);
    return null;
  }

  async filterByCentury(century: string, index: number = 1): Promise<any> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Navegador no inicializado o no logueado');
    }

    try {
      console.log(`🔍 Buscando siglo: ${century}`);
      
      const centuryBlock = await this.findCenturyBlockByIndex(century, index); 
      
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
        console.log('⏳ Esperando 2 segundos antes de hacer clic en descarga...');
        await this.page!.waitForTimeout(2000);
        
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
      
      // Mapeo de índices para los primeros 3 tomos
      const centuryIndexMap: { [key: string]: number } = { 
        'XIV': 1, 
        'XV': 3, 
        'XVI': 2
      };
      
      const index = centuryIndexMap[century] || 1;
      console.log(`🎯 Usando índice ${index} para siglo ${century}`);
      
      const previousCentury = this.getPreviousCentury(century);
      if (previousCentury) {
        console.log(`🔍 Extrayendo código del siglo anterior: ${previousCentury}`);
        const extractResult = await this.extractCodeFromPDF(previousCentury);
        
        if (extractResult.success && extractResult.code) {
          console.log(`🔓 Desbloqueando siglo ${century} con código: ${extractResult.code}`);
          await this.unlockCentury(century, extractResult.code, index);
        }
      }
      
      console.log(`🔍 Filtrando por siglo: ${century} (índice ${index})`);
      await this.filterByCentury(century, index);
      
      console.log(`📥 Descargando PDF del siglo: ${century} (índice ${index})`);
      await this.downloadPDF(century, index);
      
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

  async page1CompleteFlow(): Promise<any> {
    try {
      console.log('🔄 Iniciando flujo completo para los primeros 3 tomos...');
      
      if (!this.isLoggedIn || !this.browser || !this.page) {
        console.log('🔐 Iniciando proceso de login...');
        await this.runAutomation();
        console.log('✅ Login completado, continuando con el flujo...');
      }
      
      const centuryIndexMap: { [key: string]: number } = { 
        'XIV': 1, 
        'XV': 3, 
        'XVI': 2
      };
      const centuries = ['XIV', 'XV', 'XVI'];
      const results = [];
      
      for (const century of centuries) {
        const index = centuryIndexMap[century] || 1;
        console.log(`\n📜 Procesando siglo: ${century} (bloque #${index})`);
        
        if (century === 'XIV') {
          console.log('🔍 Filtrando por siglo XIV...');
          await this.filterByCentury(century, index);
          
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
              
              // Esperar a que aparezca el botón de descarga después del desbloqueo
              console.log('⏳ Esperando a que aparezca el botón de descarga...');
              await this.page!.waitForTimeout(2000);
              
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

  async navigateToPage(pageNumber: number): Promise<any> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Navegador no inicializado o no logueado');
    }

    try {
      
      const pageButton = await this.page.locator(`button:has-text("${pageNumber}")`).first();
      
      if (await pageButton.isVisible()) {
        await pageButton.click();
        console.log(`✅ Clic en botón de página ${pageNumber}`);
        
        await this.page.waitForTimeout(3000);
        
        return {
          success: true,
          message: `Navegación a página ${pageNumber} exitosa`
        };
      } else {
        throw new Error(`No se encontró botón de página ${pageNumber}`);
      }
    } catch (error) {
      console.error('❌ Error al navegar a la página:', error);
      throw error;
    }
  }

  async extractBookNameFromModal(): Promise<any> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Navegador no inicializado o no logueado');
    }

    try {
      console.log('📖 Extrayendo nombre del libro del modal...');
      
      const modal = await this.page.locator('[role="dialog"], .modal, .popup').first();
      const bookNameElement = await modal.locator('h3').first();
      
      if (await bookNameElement.isVisible()) {
        const rawBookName = await bookNameElement.textContent();
        console.log(`📖 Nombre del libro extraído (raw): ${rawBookName}`);
        
        let cleanBookName = rawBookName?.trim();
        
        if (cleanBookName && cleanBookName.includes('Necronomicon')) {
          cleanBookName = 'Necronomicon';
          console.log(`✅ Nombre del libro limpiado: ${cleanBookName}`);
        }
        
        console.log(`✅ Nombre del libro final: ${cleanBookName}`);
        
        return {
          success: true,
          message: `Nombre del libro extraído: ${cleanBookName}`,
          bookName: cleanBookName
        };
      } else {
        throw new Error('No se encontró elemento h3 con el nombre del libro en el modal');
      }
    } catch (error) {
      console.error('❌ Error al extraer nombre del libro:', error);
      throw error;
    }
  }

  async makeExternalAPIRequest(bookName: string, code: string): Promise<any> {
    try {
      console.log(`🌐 Haciendo petición a API externa...`);
      console.log(`📖 Libro: ${bookName}`);
      console.log(`🔑 Código: ${code}`);
      
      const url = `https://backend-production-9d875.up.railway.app/api/cipher/challenge?bookTitle=${encodeURIComponent(bookName)}&unlockCode=${encodeURIComponent(code)}`;
      console.log(`🔗 URL: ${url}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log(`📡 Respuesta de API:`, data);
      
      if (response.ok) {
        return {
          success: true,
          message: 'Petición a API externa exitosa',
          data: data
        };
      } else {
        throw new Error(`Error en petición API: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('❌ Error en petición a API externa:', error);
      throw error;
    }
  }

  async solveAlgorithmicChallenge(apiResponse: any): Promise<any> {
    try {
      console.log('🧮 Resolviendo desafío algorítmico...');
      
      const { vault, targets, hint } = apiResponse.challenge;
      
      console.log(`🔍 Vault: ${vault.join(', ')}`);
      console.log(`🎯 Targets: ${targets.join(', ')}`);
      console.log(`💡 Hint: ${hint}`);
      
      const binarySearch = (arr: any[], target: number): any => {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          
          if (mid === target) {
            return arr[mid];
          } else if (mid < target) {
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        }
        
        return null; 
      };
      
      const password = [];
      
      for (const target of targets) {
        console.log(`🔍 Buscando target ${target} en el vault...`);
        const character = binarySearch(vault, target);
        
        if (character) {
          password.push(character);
          console.log(`✅ Encontrado: ${character} en posición ${target}`);
        } else {
          console.log(`❌ No se encontró caracter en posición ${target}`);
        }
      }
      
      const finalPassword = password.join('');
      console.log(`🔐 Contraseña construida: ${finalPassword}`);
      
      if (finalPassword.length > 0) {
        return {
          success: true,
          message: `Desafío algorítmico resuelto: ${finalPassword}`,
          password: finalPassword
        };
      } else {
        throw new Error('No se pudo construir la contraseña');
      }
      
    } catch (error) {
      console.error('❌ Error resolviendo desafío algorítmico:', error);
      throw error;
    }
  }

  async closeModal(): Promise<any> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Navegador no inicializado o no logueado');
    }

    try {
      console.log('❌ Cerrando modal...');
      
      const closeSelectors = [
        'button[aria-label="Cerrar modal"]',
        'button[aria-label="Close modal"]',
        'button:has-text("Cerrar")',
        'button:has-text("Close")',
        '[data-testid="close-modal"]',
        '.modal button:last-child'
      ];
      
      for (const selector of closeSelectors) {
        try {
          const closeButton = await this.page.locator(selector).first();
          if (await closeButton.isVisible()) {
            await closeButton.click();
            console.log(`✅ Modal cerrado con selector: ${selector}`);
            await this.page.waitForTimeout(1000);
            return {
              success: true,
              message: 'Modal cerrado exitosamente'
            };
          }
        } catch (e) {
          continue;
        }
      }
      
      try {
        await this.page.keyboard.press('Escape');
        console.log('✅ Modal cerrado con Escape');
        return {
          success: true,
          message: 'Modal cerrado con Escape'
        };
      } catch (e) {
        console.log('⚠️ No se pudo cerrar el modal');
        return {
          success: false,
          message: 'No se pudo cerrar el modal'
        };
      }
    } catch (error) {
      console.error('❌ Error al cerrar modal:', error);
      throw error;
    }
  }

  async processSpecialCentury(century: string): Promise<any> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Navegador no inicializado o no logueado');
    }

    try {
      console.log(`🔮 Procesando siglo especial: ${century}`);
      
      const previousCentury = this.getPreviousCentury(century);
      if (!previousCentury) {
        throw new Error(`No se encontró siglo anterior para ${century}`);
      }
      
      console.log(`🔍 Extrayendo código del siglo anterior: ${previousCentury}`);
      const extractResult = await this.extractCodeFromPDF(previousCentury);
      
      if (!extractResult.success || !extractResult.code) {
        throw new Error(`No se pudo extraer código del siglo ${previousCentury}`);
      }
      
      const code = extractResult.code;
      console.log(`✅ Código extraído del siglo ${previousCentury}: ${code}`);
      
      if (century === 'XVII') {
        await this.navigateToPage(2);
        await this.page!.waitForTimeout(2000);
      }
      
      let centuryIndex = 1;
      if (century === 'XVII') {
        centuryIndex = 2; // En la página 2, XVII está en posición 2
        console.log('🎯 Seleccionando el segundo elemento (Siglo XVII)...');
      } else if (century === 'XVIII') {
        centuryIndex = 1; // En la página 2, XVIII está en posición 1
        console.log('🎯 Seleccionando el primer elemento (Siglo XVIII)...');
      }
      
      console.log(`🔍 Filtrando por siglo ${century} (índice ${centuryIndex})...`);
      const centuryBlock = await this.findCenturyBlockByIndex(century, centuryIndex);
      if (!centuryBlock) {
        throw new Error(`No se encontró el bloque #${centuryIndex} del siglo ${century}`);
      }
      
      console.log('📖 Extrayendo nombre del libro del bloque...');
      const bookNameElement = await centuryBlock.locator('h3').first();
      
      if (await bookNameElement.isVisible()) {
        const rawBookName = await bookNameElement.textContent();
        console.log(`📖 Nombre del libro extraído (raw): ${rawBookName}`);
        
        let cleanBookName = rawBookName?.trim();
        
        if (cleanBookName && cleanBookName.includes('Necronomicon')) {
          cleanBookName = 'Necronomicon';
          console.log(`✅ Nombre del libro limpiado: ${cleanBookName}`);
        }
        
        console.log(`✅ Nombre del libro final: ${cleanBookName}`);
        const bookName = cleanBookName;
        
        console.log('📖 Haciendo clic en "Ver Documentación"...');
        
        let documentationButton = null;
        
        try {
          documentationButton = await centuryBlock.locator('button:has-text("Ver Documentación")').first();
          if (await documentationButton.isVisible()) {
            console.log('✅ Encontrado botón con selector directo');
          } else {
            documentationButton = null;
          }
        } catch (e) {
          console.log('🔍 Selector directo no funcionó, buscando alternativas...');
        }
        
        if (!documentationButton) {
          console.log('🔍 Buscando en todos los botones del bloque...');
          const allButtons = await centuryBlock.locator('button').all();
          
          for (const button of allButtons) {
            try {
              const text = (await button.textContent())?.toLowerCase().trim();
              console.log(`🔍 Botón con texto: "${text}"`);
              
              if (text && (text.includes('ver documentación') || text.includes('documentación'))) {
                documentationButton = button;
                console.log(`✅ Encontrado botón con texto: "${text}"`);
                break;
              }
            } catch (e) {
              continue;
            }
          }
        }
        
        if (!documentationButton) {
          console.log('🔍 Buscando en enlaces del bloque...');
          const allLinks = await centuryBlock.locator('a').all();
          
          for (const link of allLinks) {
            try {
              const text = (await link.textContent())?.toLowerCase().trim();
              console.log(`🔍 Enlace con texto: "${text}"`);
              
              if (text && (text.includes('ver documentación') || text.includes('documentación'))) {
                documentationButton = link;
                console.log(`✅ Encontrado enlace con texto: "${text}"`);
                break;
              }
            } catch (e) {
              continue;
            }
          }
        }
        
        if (documentationButton && await documentationButton.isVisible()) {
          await documentationButton.click();
          await this.page!.waitForTimeout(2000);
          console.log('✅ Modal abierto');
        } else {
          throw new Error('No se encontró el botón "Ver Documentación"');
        }
        
        console.log('🌐 Haciendo petición a API externa...');
        const apiResult = await this.makeExternalAPIRequest(bookName, code);
        if (!apiResult.success) {
          throw new Error('Error en petición a API externa');
        }
        
        console.log('🧮 Resolviendo desafío algorítmico...');
        const challengeResult = await this.solveAlgorithmicChallenge(apiResult.data);
        if (!challengeResult.success) {
          throw new Error('Error resolviendo desafío algorítmico');
        }
        
        const password = challengeResult.password;
        console.log(`✅ Contraseña obtenida: ${password}`);
        
        console.log('⏳ Esperando 2 segundos después de resolver el desafío...');
        await this.page!.waitForTimeout(2000);
        
        console.log('❌ Cerrando modal...');
        const closeButton = await this.page.locator('button[aria-label="Cerrar modal"]').first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          console.log('✅ Modal cerrado con botón aria-label="Cerrar modal"');
        } else {
          console.log('⚠️ No se encontró botón con aria-label="Cerrar modal", intentando otros métodos...');
          await this.closeModal();
        }
        
        console.log('⏳ Esperando 2 segundos después de cerrar el modal...');
        await this.page!.waitForTimeout(2000);
        
        console.log(`🔓 Desbloqueando siglo ${century} con contraseña: ${password}`);
        const unlockResult = await this.unlockCentury(century, password, centuryIndex);
        if (!unlockResult.success) {
          throw new Error('Error al desbloquear siglo');
        }
        
        console.log('❌ Cerrando nuevo modal después del desbloqueo...');
        await this.page!.waitForTimeout(1000); // Esperar a que aparezca el modal
        await this.closeModal();
        
        console.log(`📥 Descargando PDF del siglo ${century}...`);
        const downloadResult = await this.downloadPDF(century, centuryIndex);
        if (!downloadResult.success) {
          throw new Error('Error al descargar PDF del siglo');
        }
        
        return {
          success: true,
          message: `Siglo ${century} procesado exitosamente`,
          bookName: bookName,
          password: password,
          previousCentury: previousCentury,
          extractedCode: code,
          downloadResult: downloadResult
        };
        
      } else {
        throw new Error('No se encontró elemento h3 con el nombre del libro en el bloque del siglo');
      }
      
    } catch (error) {
      console.error(`❌ Error procesando siglo especial ${century}:`, error);
      throw error;
    }
  }

  async page2CompleteFlow(): Promise<any> {
    try {
      console.log('🔄 Iniciando flujo completo para los últimos 2 tomos...');
      
      if (!this.isLoggedIn || !this.browser || !this.page) {
        console.log('🔐 Iniciando proceso de login...');
        await this.runAutomation();
        console.log('✅ Login completado, continuando con el flujo...');
        await this.page!.waitForTimeout(3000);
      }
      
      const results = [];
      
      const centuries = ['XVII', 'XVIII'];
      
      for (const century of centuries) {
        console.log(`\n📜 Procesando siglo especial: ${century}`);
        
        console.log('📄 Navegando a la página 2 para siglos especiales...');
        await this.navigateToPage(2);
        await this.page!.waitForTimeout(3000);
        
        const result = await this.processSpecialCentury(century);
        results.push({ century, result });
        
        console.log(`⏳ Esperando 3 segundos después de procesar siglo especial ${century}...`);
        await this.page!.waitForTimeout(3000);
      }
      
      console.log('\n✅ Flujo completo finalizado para los últimos 2 tomos');
      console.log('📊 Resumen de resultados:');
      results.forEach(({ century, result }) => {
        console.log(`- Siglo ${century}: ${result.success ? '✅ Exitoso' : '❌ Fallido'}`);
      });
      
      return {
        success: true,
        message: 'Flujo completo ejecutado exitosamente para los últimos 2 tomos',
        results: results
      };
      
    } catch (error) {
      console.error('❌ Error en flujo completo:', error);
      throw error;
    }
  }

  async runCompleteFlow(): Promise<any> {
    try {
      console.log('🔄 Iniciando flujo completo para todos los 5 tomos...');
      
      const page1Result = await this.page1CompleteFlow();
      console.log('✅ Página 1 completada, iniciando página 2...');
      
      const page2Result = await this.page2CompleteFlow();
      console.log('✅ Página 2 completada');
      
      return {
        success: true,
        message: 'Flujo completo ejecutado exitosamente para todos los 5 tomos',
        page1Result: page1Result,
        page2Result: page2Result
      };
      
    } catch (error) {
      console.error('❌ Error en flujo completo:', error);
      throw error;
    }
  }

} 