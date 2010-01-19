<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <xsl:for-each select="Previsione">
        <div id="meteo_sintesi">
            <!--<h1>Forecast</h1> -->
            <div class="meteo_head">
                <div class="meteo_desc">
                    <b>Weather evolution: </b><xsl:value-of select="EvoluzioneTempo"/>
                </div>
                <br /><div>Published on <xsl:value-of select="Pubblicato"/> h. 13 next: <xsl:value-of select="ProssimaEmissione"/></div>
            </div>
            <hr class="large" />
        </div>
        <div id="meteo_oggi">
            <div class="meteo_date_header">Weather forecast for today, <xsl:value-of select="Oggi/Data"/></div>
            <table cols="2" width="90%" style="margin: auto auto;padding-top:20px;">
                <tr>
                    <td width="50%">
                        <div class="meteo_image">
                            <img src="{Oggi/imgtrentino}"/>
                        </div>
                    </td>
                    <td width="50%" valign="top">
                        <div class="meteo_desc">
                            <p><xsl:value-of select="Oggi/CieloDesc"/></p>
                            <ul>
                                <li><b>Precipitation: </b> <xsl:value-of select="Oggi/PrecInten"/> - <xsl:value-of select="Oggi/PrecEstens"/></li>
                                <li><b>Precipitation probability: </b> <xsl:value-of select="Oggi/PrecProb"/></li>
                                <xsl:variable name="ventiDesc"><xsl:value-of select="Oggi/VentiDesc"/></xsl:variable>
                                <xsl:if test="not($ventiDesc='')"><li><b>Wind description: </b> <xsl:value-of select="Oggi/VentiDesc"/></li></xsl:if>
                                <li><b>Temperature: </b> <xsl:value-of select="Oggi/TempDesc"/></li>
                                <li>
                                    <ul style="text-indent: 1em !important">
                                        <li><b> - Valley: </b> max <xsl:value-of select="Oggi/TempMaxValle"/>°C</li>
                                        <li><b> - Mountain (2000m): </b> max <xsl:value-of select="Oggi/TempMaxQuota"/>°C</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="meteo_domani">
            <div class="meteo_date_header">Tomorrow <xsl:value-of select="Domani/Data"/></div>
            <div class="meteo_image">
                <h2>Morning</h2>
                <img src="{Domani/imgtrentino}"/>
            </div>
            <div class="meteo_image">
                <h2>Afternoon/Evening</h2>
                <img src="{Domani/imgtrentino2}"/>
            </div>
            <div class="meteo_desc">
                <p>
                    <xsl:value-of select="Domani/CieloDesc"/>
                </p>
                <p>
                    <b>Precipitation: </b> <xsl:value-of select="Oggi/PrecInten"/> -  <xsl:value-of select="Oggi/PrecEstens"/> <br/>
                    <b>Precipitation probability: </b> <xsl:value-of select="Domani/PrecProb"/><br/>
                    <b>Wind: </b> <xsl:value-of select="Domani/VentiDesc"/><br/>
                    <xsl:variable name="ventiDescDom"><xsl:value-of select="Domani/VentiDesc"/></xsl:variable>
                    <xsl:if test="not($ventiDescDom='')"><b>Wind description: </b>  <xsl:value-of select="Domani/VentiDesc"/><br/></xsl:if>
                    <b>Temperature: </b>  <xsl:value-of select="Domani/TempDesc"/><br/>
                    <b>Temperature: </b>  min <xsl:value-of select="Domani/TempMinValle"/>°C / max <xsl:value-of select="Domani/TempMaxValle"/>°C (valley)<br/>
                    <b>Temperature: </b> min <xsl:value-of select="Domani/TempMinQuota"/>°C / max <xsl:value-of select="Domani/TempMaxQuota"/>°C (mountain 2000m)
                </p>
            </div>
        </div>
        <div id="meteo_dopodomani">
            <div class="meteo_date_header">Weather forecast for <xsl:value-of select="DopoDomani/Data"/></div>
            <div class="meteo_image">
                <h2>Morning</h2>
                <img src="{DopoDomani/imgtrentino}"/>
            </div>
            <div class="meteo_image">
                <h2>Afternoon/Evening</h2>
                <img src="{DopoDomani/imgtrentino2}"/>
            </div>
            <div class="meteo_desc">
                <p>
                    <xsl:value-of select="DopoDomani/CieloDesc"/>
                </p>
                <p>
                    <b>Precipitation: </b> <xsl:value-of select="DopoDomani/PrecInten"/> -  <xsl:value-of select="DopoDomani/PrecEstens"/> <br/>
                    <b>Precipitation probability: </b> <xsl:value-of select="DopoDomani/PrecProb"/><br/>
                    <b>Temperature: </b><xsl:value-of select="DopoDomani/TempDesc"/><br/>
                    <b>Temperature: </b>  min <xsl:value-of select="DopoDomani/TempMinValle"/>°C / max <xsl:value-of select="DopoDomani/TempMaxValle"/>°C (valley)<br/>
                    <b>Temperature: </b> min <xsl:value-of select="DopoDomani/TempMinQuota"/>°C / max <xsl:value-of select="DopoDomani/TempMaxQuota"/>°C (mountain 2000m)
                </p>
            </div>
        </div>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>  
