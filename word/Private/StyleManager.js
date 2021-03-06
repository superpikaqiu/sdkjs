/*
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

//----------------------------------------------------------------------------------------------------------------------
//  asc_docs_api (Обращение из апи)
//----------------------------------------------------------------------------------------------------------------------
Asc['asc_docs_api'].prototype.asc_GetStyleFromFormatting = function()
{
    return this.WordControl.m_oLogicDocument.GetStyleFromFormatting();
};
Asc['asc_docs_api'].prototype.asc_AddNewStyle = function(oStyle)
{
    this.WordControl.m_oLogicDocument.Add_NewStyle(oStyle);
};
Asc['asc_docs_api'].prototype.asc_RemoveStyle = function(sName)
{
    this.WordControl.m_oLogicDocument.Remove_Style(sName);
};
Asc['asc_docs_api'].prototype.asc_RemoveAllCustomStyles = function()
{
    this.WordControl.m_oLogicDocument.Remove_AllCustomStyles();
};
Asc['asc_docs_api'].prototype.asc_IsStyleDefault = function(sName)
{
    return this.WordControl.m_oLogicDocument.Is_StyleDefault(sName);
};
Asc['asc_docs_api'].prototype.asc_IsDefaultStyleChanged = function(sName)
{
    return this.WordControl.m_oLogicDocument.Is_DefaultStyleChanged(sName);
};

Asc['asc_docs_api'].prototype['asc_GetStyleFromFormatting'] = Asc['asc_docs_api'].prototype.asc_GetStyleFromFormatting;
Asc['asc_docs_api'].prototype['asc_AddNewStyle']            = Asc['asc_docs_api'].prototype.asc_AddNewStyle;
Asc['asc_docs_api'].prototype['asc_RemoveStyle']            = Asc['asc_docs_api'].prototype.asc_RemoveStyle;
Asc['asc_docs_api'].prototype['asc_RemoveAllCustomStyles']  = Asc['asc_docs_api'].prototype.asc_RemoveAllCustomStyles;
Asc['asc_docs_api'].prototype['asc_IsStyleDefault']         = Asc['asc_docs_api'].prototype.asc_IsStyleDefault;
Asc['asc_docs_api'].prototype['asc_IsDefaultStyleChanged']  = Asc['asc_docs_api'].prototype.asc_IsDefaultStyleChanged;
//----------------------------------------------------------------------------------------------------------------------
//  CDocument
//----------------------------------------------------------------------------------------------------------------------
/**
 * Получаем стиль по выделенному фрагменту
 */
CDocument.prototype.GetStyleFromFormatting = function()
{
	return this.Controller.GetStyleFromFormatting();
};
/**
 * Добавляем новый стиль (или заменяем старый с таким же названием).
 * И сразу применяем его к выделенному фрагменту.
 */
CDocument.prototype.Add_NewStyle = function(oStyle)
{
    if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_Document_Styles, {Type : AscCommon.changestype_2_AdditionalTypes, Types : [AscCommon.changestype_Paragraph_Properties]}))
    {
        this.StartAction(AscDFH.historydescription_Document_AddNewStyle);
        var NewStyle = this.Styles.Create_StyleFromInterface(oStyle);
        this.SetParagraphStyle(NewStyle.Get_Name());
        this.Recalculate();
        this.UpdateInterface();
        this.FinalizeAction();
    }
};
/**
 * Удаляем заданный стиль по имени.
 */
CDocument.prototype.Remove_Style = function(sStyleName)
{
    var StyleId = this.Styles.GetStyleIdByName(sStyleName);
    // Сначала проверим есть ли стиль с таким именем
    if (null == StyleId)
        return;

    if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_Document_Styles))
    {
        this.StartAction(AscDFH.historydescription_Document_RemoveStyle);
        this.Styles.Remove_StyleFromInterface(StyleId);
        this.Recalculate();
        this.UpdateInterface();
        this.FinalizeAction();
    }
};
/**
 * Удаляем все недефолтовые стили в документе.
 */
CDocument.prototype.Remove_AllCustomStyles = function()
{
    if (false === this.Document_Is_SelectionLocked(AscCommon.changestype_Document_Styles))
    {
        this.StartAction(AscDFH.historydescription_Document_RemoveAllCustomStyles);
        this.Styles.Remove_AllCustomStylesFromInterface();
        this.Recalculate();
        this.UpdateInterface();
        this.FinalizeAction();
    }
};
/**
 * Проверяем является ли заданный стиль дефолтовым.
 */
CDocument.prototype.Is_StyleDefault = function(sName)
{
    return this.Styles.Is_StyleDefault(sName);
};
/**
 * Проверяем изменен ли дефолтовый стиль.
 */
CDocument.prototype.Is_DefaultStyleChanged = function(sName)
{
    return this.Styles.Is_DefaultStyleChanged(sName);
};
//----------------------------------------------------------------------------------------------------------------------
//  CStyles
//----------------------------------------------------------------------------------------------------------------------
CStyles.prototype.Create_StyleFromInterface = function(oAscStyle, bCheckLink)
{
	var sStyleName = oAscStyle.get_Name();
	var sStyleId   = this.GetStyleIdByName(sStyleName);
	if (null !== sStyleId)
	{
		var oStyle = this.Style[sStyleId];

		var NewStyleParaPr = oAscStyle.get_ParaPr();
		var NewStyleTextPr = oAscStyle.get_TextPr();

		var BasedOnId = this.GetStyleIdByName(oAscStyle.get_BasedOn());
		var NextId    = this.GetStyleIdByName(oAscStyle.get_Next());

		oStyle.Set_Type(oAscStyle.get_Type());

		if (BasedOnId === sStyleId || sStyleId === this.Default.Paragraph)
		{
			if (sStyleId !== this.Default.Paragraph)
			{
				var oBaseStyle      = this.Get(BasedOnId);
				var oBasedBasesOnId = this.Get_Default_Paragraph();
				if (oBaseStyle)
				{
					oBasedBasesOnId = oBaseStyle.Get_BasedOn();
					if (oBaseStyle.Get_BasedOn() !== sStyleId)
						oBasedBasesOnId = oBaseStyle.Get_BasedOn();
				}

				oStyle.Set_BasedOn(oBasedBasesOnId);
			}
			else
			{
				oStyle.Set_BasedOn(null);
			}

			var OldStyleParaPr = oStyle.ParaPr.Copy();
			var OldStyleTextPr = oStyle.TextPr.Copy();
			OldStyleParaPr.Merge(NewStyleParaPr);
			OldStyleTextPr.Merge(NewStyleTextPr);
			NewStyleParaPr = OldStyleParaPr;
			NewStyleTextPr = OldStyleTextPr;
		}
		else
		{
			oStyle.Set_BasedOn(BasedOnId);
		}

		if (null === oStyle.Get_Next() || (null !== NextId && NextId !== sStyleId))
		{
			if (NextId === sStyleId)
				oStyle.Set_Next(null);
			else
				oStyle.Set_Next(NextId);
		}

		var oAscLink   = oAscStyle.get_Link();
		var sOldLinkId = oStyle.Get_Link();
		if (sOldLinkId && this.Style[sOldLinkId])
			oAscLink.put_Name(this.Style[sOldLinkId].GetName());
		else
			bCheckLink = false;

		if (false != bCheckLink && null != oAscLink && undefined !== oAscLink)
		{
			var oLinkedStyle = this.Create_StyleFromInterface(oAscLink, false);
			oStyle.Set_Link(oLinkedStyle.Get_Id());
			oLinkedStyle.Set_Link(oStyle.Get_Id());
		}

		oStyle.Set_TextPr(NewStyleTextPr);
		oStyle.Set_ParaPr(NewStyleParaPr, true);

		return oStyle;
	}
	else
	{
		var oStyle = new CStyle();

		var BasedOnId = this.GetStyleIdByName(oAscStyle.get_BasedOn());
		oStyle.Set_BasedOn(BasedOnId);
		oStyle.Set_Next(this.GetStyleIdByName(oAscStyle.get_Next()));
		oStyle.Set_Type(oAscStyle.get_Type());
		oStyle.Set_TextPr(oAscStyle.get_TextPr());
		oStyle.Set_ParaPr(oAscStyle.get_ParaPr(), true);
		oStyle.Set_Name(sStyleName);
		oStyle.SetCustom(true);

		if (styletype_Paragraph === oStyle.Get_Type())
			oStyle.Set_QFormat(true);

		var oAscLink = oAscStyle.get_Link();
		if (false != bCheckLink && null != oAscLink && undefined !== oAscLink)
		{
			var oLinkedStyle = this.Create_StyleFromInterface(oAscLink, false);
			oStyle.Set_Link(oLinkedStyle.Get_Id());
			oLinkedStyle.Set_Link(oStyle.Get_Id());
		}

		this.Add(oStyle);
		return oStyle;
	}
};
CStyles.prototype.Remove_StyleFromInterface = function(StyleId)
{
    // Если этот стиль не один из стилей по умолчанию, тогда мы просто удаляем этот стиль
    // и очищаем все параграфы с сылкой на этот стиль.

    var Style = this.Style[StyleId];
    if (StyleId == this.Default.Paragraph)
    {
        Style.Clear("Normal", null, null, styletype_Paragraph);
        Style.CreateNormal();
    }
    else if (StyleId == this.Default.Character)
    {
        Style.Clear("Default Paragraph Font", null, null, styletype_Character);
        Style.CreateDefaultParagraphFont();
    }
    else if (StyleId == this.Default.Numbering)
    {
        Style.Clear("No List", null, null, styletype_Numbering);
        Style.CreateNoList();
    }
    else if (StyleId == this.Default.Table)
    {
        Style.Clear("Normal Table", null, null, styletype_Table);
        Style.Create_NormalTable();
    }
    else if (StyleId == this.Default.TableGrid)
    {
        Style.Clear("Table Grid", this.Default.Table, null, styletype_Table);
        Style.Create_TableGrid();
    }
    else if (StyleId == this.Default.Headings[0])
    {
        Style.Clear("Heading 1", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(0);
    }
    else if (StyleId == this.Default.Headings[1])
    {
        Style.Clear("Heading 2", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(1);
    }
    else if (StyleId == this.Default.Headings[2])
    {
        Style.Clear("Heading 3", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(2);
    }
    else if (StyleId == this.Default.Headings[3])
    {
        Style.Clear("Heading 4", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(3);
    }
    else if (StyleId == this.Default.Headings[4])
    {
        Style.Clear("Heading 5", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(4);
    }
    else if (StyleId == this.Default.Headings[5])
    {
        Style.Clear("Heading 6", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(5);
    }
    else if (StyleId == this.Default.Headings[6])
    {
        Style.Clear("Heading 7", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(6);
    }
    else if (StyleId == this.Default.Headings[7])
    {
        Style.Clear("Heading 8", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(7);
    }
    else if (StyleId == this.Default.Headings[8])
    {
        Style.Clear("Heading 9", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(8);
    }
    else if (StyleId == this.Default.ParaList)
    {
        Style.Clear("List Paragraph", this.Default.Paragraph, null, styletype_Paragraph);
        Style.CreateListParagraph();
    }
    else if (StyleId == this.Default.Header)
    {
        Style.Clear("Header", this.Default.Paragraph, null, styletype_Paragraph);
        Style.CreateHeader();
    }
    else if (StyleId == this.Default.Footer)
    {
        Style.Clear("Footer", this.Default.Paragraph, null, styletype_Paragraph);
        Style.CreateFooter();
    }
    else if (StyleId == this.Default.Hyperlink)
    {
        Style.Clear("Hyperlink", null, null, styletype_Character);
        Style.CreateHyperlink();
    }
	else if (StyleId == this.Default.NoSpacing)
	{
		Style.Clear("No Spacing", this.Default.Paragraph, null, styletype_Paragraph);
		Style.CreateNoSpacing();
	}
	else if (StyleId === this.Default.Title)
	{
		Style.Clear("Title", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
		Style.CreateTitle();
	}
	else if (StyleId === this.Default.Subtitle)
	{
		Style.Clear("Subtitle", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
		Style.CreateSubtitle();
	}
	else if (StyleId === this.Default.Quote)
	{
		Style.Clear("Quote", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
		Style.CreateQuote();
	}
	else if (StyleId === this.Default.IntenseQuote)
	{
		Style.Clear("Intense Quote", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
		Style.CreateIntenseQuote();
	}
    else
    {
        this.Remove(StyleId);

        if (this.LogicDocument)
        {
            var AllParagraphs = this.LogicDocument.GetAllParagraphsByStyle([StyleId]);
            var Count = AllParagraphs.length;
            for (var Index = 0; Index < Count; Index++)
            {
                var Para = AllParagraphs[Index];
                Para.Style_Remove();
            }
        }
    }
    this.Update_Interface(StyleId);
};
CStyles.prototype.Remove_AllCustomStylesFromInterface = function()
{
    for (var StyleId in this.Style)
    {
        var Style = this.Style[StyleId];
        if ((styletype_Paragraph === Style.GetType() || styletype_Character === Style.GetType()) && true === Style.GetQFormat())
        {
            this.Remove_StyleFromInterface(StyleId);
        }
    }
};
CStyles.prototype.Is_StyleDefault = function(sStyleName)
{
    var StyleId = this.GetStyleIdByName(sStyleName);
    if (null === StyleId)
        return false;

    if (StyleId == this.Default.Paragraph
        || StyleId == this.Default.Character
        || StyleId == this.Default.Numbering
        || StyleId == this.Default.Table
        || StyleId == this.Default.TableGrid
        || StyleId == this.Default.Headings[0]
        || StyleId == this.Default.Headings[1]
        || StyleId == this.Default.Headings[2]
        || StyleId == this.Default.Headings[3]
        || StyleId == this.Default.Headings[4]
        || StyleId == this.Default.Headings[5]
        || StyleId == this.Default.Headings[6]
        || StyleId == this.Default.Headings[7]
        || StyleId == this.Default.Headings[8]
        || StyleId == this.Default.ParaList
        || StyleId == this.Default.Header
        || StyleId == this.Default.Footer
        || StyleId == this.Default.Hyperlink
		|| StyleId == this.Default.FootnoteText
		|| StyleId == this.Default.FootnoteTextChar
		|| StyleId == this.Default.FootnoteReference
		|| StyleId == this.Default.NoSpacing
		|| StyleId == this.Default.Title
		|| StyleId == this.Default.Subtitle
		|| StyleId == this.Default.Quote
		|| StyleId == this.Default.IntenseQuote)
    {
        return true;
    }

    return false;
};
CStyles.prototype.Is_DefaultStyleChanged = function(sStyleName)
{
    if (true != this.Is_StyleDefault(sStyleName))
        return false;

    var StyleId = this.GetStyleIdByName(sStyleName);
    if (null === StyleId)
        return false;

    var CurrentStyle = this.Style[StyleId];
    this.LogicDocument.TurnOffHistory();

    var Style = new CStyle();
    if (StyleId == this.Default.Paragraph)
    {
        Style.Clear("Normal", null, null, styletype_Paragraph);
        Style.CreateNormal();
    }
    else if (StyleId == this.Default.Character)
    {
        Style.Clear("Default Paragraph Font", null, null, styletype_Character);
        Style.CreateDefaultParagraphFont();
    }
    else if (StyleId == this.Default.Numbering)
    {
        Style.Clear("No List", null, null, styletype_Numbering);
        Style.CreateNoList();
    }
    else if (StyleId == this.Default.Table)
    {
        Style.Clear("Normal Table", null, null, styletype_Table);
        Style.Create_NormalTable();
    }
    else if (StyleId == this.Default.TableGrid)
    {
        Style.Clear("Table Grid", this.Default.Table, null, styletype_Table);
        Style.Create_TableGrid();
    }
    else if (StyleId == this.Default.Headings[0])
    {
        Style.Clear("Heading 1", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(0);
    }
    else if (StyleId == this.Default.Headings[1])
    {
        Style.Clear("Heading 2", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(1);
    }
    else if (StyleId == this.Default.Headings[2])
    {
        Style.Clear("Heading 3", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(2);
    }
    else if (StyleId == this.Default.Headings[3])
    {
        Style.Clear("Heading 4", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(3);
    }
    else if (StyleId == this.Default.Headings[4])
    {
        Style.Clear("Heading 5", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(4);
    }
    else if (StyleId == this.Default.Headings[5])
    {
        Style.Clear("Heading 6", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(5);
    }
    else if (StyleId == this.Default.Headings[6])
    {
        Style.Clear("Heading 7", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(6);
    }
    else if (StyleId == this.Default.Headings[7])
    {
        Style.Clear("Heading 8", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(7);
    }
    else if (StyleId == this.Default.Headings[8])
    {
        Style.Clear("Heading 9", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
        Style.CreateHeading(8);
    }
    else if (StyleId == this.Default.ParaList)
    {
        Style.Clear("List Paragraph", this.Default.Paragraph, null, styletype_Paragraph);
        Style.CreateListParagraph();
    }
    else if (StyleId == this.Default.Header)
    {
        Style.Clear("Header", this.Default.Paragraph, null, styletype_Paragraph);
        Style.CreateHeader();
    }
    else if (StyleId == this.Default.Footer)
    {
        Style.Clear("Footer", this.Default.Paragraph, null, styletype_Paragraph);
        Style.CreateFooter();
    }
    else if (StyleId == this.Default.Hyperlink)
    {
        Style.Clear("Hyperlink", null, null, styletype_Character);
        Style.CreateHyperlink();
    }
    else if (StyleId == this.Default.NoSpacing)
	{
		Style.Clear("No Spacing", this.Default.Paragraph, null, styletype_Paragraph);
		Style.CreateNoSpacing();
	}
	else if (StyleId === this.Default.Title)
	{
		Style.Clear("Title", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
		Style.CreateTitle();
	}
	else if (StyleId === this.Default.Subtitle)
	{
		Style.Clear("Subtitle", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
		Style.CreateSubtitle();
	}
	else if (StyleId === this.Default.Quote)
	{
		Style.Clear("Quote", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
		Style.CreateQuote();
	}
	else if (StyleId === this.Default.IntenseQuote)
	{
		Style.Clear("Intense Quote", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
		Style.CreateIntenseQuote();
	}

    this.LogicDocument.TurnOnHistory();

    return (true === Style.Is_Equal(CurrentStyle) ? false : true);
};
