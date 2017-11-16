/*
 * (c) Copyright Ascensio System SIA 2010-2017
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
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
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
/**
 * User: Ilja.Kirillov
 * Date: 20.10.2017
 * Time: 15:46
 */

var fieldtype_UNKNOWN    = 0x0000;
var fieldtype_MERGEFIELD = 0x0001;
var fieldtype_PAGENUM    = 0x0002;
var fieldtype_PAGE       = fieldtype_PAGENUM;
var fieldtype_PAGECOUNT  = 0x0003;
var fieldtype_FORMTEXT   = 0x0004;
var fieldtype_TOC        = 0x0005;
var fieldtype_PAGEREF    = 0x0006;

/**
 * Базовый класс для инструкции сложного поля.
 * @constructor
 */
function CFieldInstructionBase()
{
}
CFieldInstructionBase.prototype.Type = fieldtype_UNKNOWN;
CFieldInstructionBase.prototype.GetType = function()
{
	return this.Type;
};

/**
 * PAGE field
 * @constructor
 */
function CFieldInstructionPAGE()
{
	CFieldInstructionBase.call(this);
}

CFieldInstructionPAGE.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionPAGE.prototype.constructor = CFieldInstructionPAGE;
CFieldInstructionPAGE.prototype.Type = fieldtype_PAGE;

/**
 * PAGEREF field
 * @constructor
 */
function CFieldInstructionPAGEREF(sBookmarkName, isHyperlink, isPositionRelative)
{
	CFieldInstructionBase.call(this);

	this.BookmarkName = sBookmarkName ? sBookmarkName : "";
	this.Hyperlink    = isHyperlink ? true : false;
	this.PosRelative  = isPositionRelative ? true : false;
}

CFieldInstructionPAGEREF.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionPAGEREF.prototype.constructor = CFieldInstructionPAGEREF;
CFieldInstructionPAGEREF.prototype.Type = fieldtype_PAGEREF;
CFieldInstructionPAGEREF.prototype.SetHyperlink = function(isHyperlink)
{
	this.Hyperlink   = isHyperlink ? true : false;
};
CFieldInstructionPAGEREF.prototype.SetPositionRelative = function(isPosRel)
{
	this.PosRelative = isPosRel ? true : false;
};
CFieldInstructionPAGEREF.prototype.IsHyperlink = function()
{
	return this.Hyperlink;
};
CFieldInstructionPAGEREF.prototype.IsPositionRelative = function()
{
	return this.PosRelative;
};
CFieldInstructionPAGEREF.prototype.GetBookmarkName = function()
{
	return this.BookmarkName;
};

/**
 * TOC field
 * @constructor
 */
function CFieldInstructionTOC()
{
	CFieldInstructionBase.call(this);

	this.PreserveTabs     = false;
	this.RemoveBreaks     = true;
	this.Hyperlinks       = false;
	this.Separator        = "";
	this.HeadingS         = -1;
	this.HeadingE         = -1;
	this.Styles           = [];
	this.SkipPageRef      = false;
	this.SkipPageRefStart = -1;
	this.SkipPageRefEnd   = -1;
}

CFieldInstructionTOC.prototype = Object.create(CFieldInstructionBase.prototype);
CFieldInstructionTOC.prototype.constructor = CFieldInstructionTOC;
CFieldInstructionTOC.prototype.Type = fieldtype_TOC;
CFieldInstructionTOC.prototype.IsPreserveTabs = function()
{
	return this.PreserveTabs;
};
CFieldInstructionTOC.prototype.SetPreserveTabs = function(isPreserve)
{
	this.PreserveTabs = isPreserve;
};
CFieldInstructionTOC.prototype.IsRemoveBreaks = function()
{
	return this.RemoveBreaks;
};
CFieldInstructionTOC.prototype.SetRemoveBreaks = function(isRemove)
{
	this.RemoveBreaks = isRemove;
};
CFieldInstructionTOC.prototype.IsHyperlinks = function()
{
	return this.Hyperlinks;
};
CFieldInstructionTOC.prototype.SetHyperlinks = function(isHyperlinks)
{
	this.Hyperlinks = isHyperlinks;
};
CFieldInstructionTOC.prototype.SetSeparator = function(sSeparator)
{
	this.Separator = sSeparator;
};
CFieldInstructionTOC.prototype.GetSeparator = function()
{
	return this.Separator;
};
CFieldInstructionTOC.prototype.SetHeadingRange = function(nStart, nEnd)
{
	this.HeadingS = nStart;
	this.HeadingE = nEnd;
};
CFieldInstructionTOC.prototype.GetHeadingRangeStart = function()
{
	return this.HeadingS;
};
CFieldInstructionTOC.prototype.GetHeadingRangeEnd = function()
{
	return this.HeadingE;
};
CFieldInstructionTOC.prototype.SetStylesArrayRaw = function(sString)
{
	// В спецификации написано, то разделено запятыми, но на деле Word реагирует на точку с запятой
	var arrValues = sString.split(";");
	var arrStyles = [];

	for (var nIndex = 0, nCount = arrValues.length; nIndex < nCount; ++nIndex)
	{
		var sValue = arrValues[nIndex];
		var nPos = sValue.lastIndexOf(',');
		if (nPos <= 0)
			continue;

		var sName = sValue.substr(0, nPos);
		var nLvl  = parseInt(sValue.substr(nPos + 1));
		if (isNaN(nLvl))
			continue;

		arrStyles.push({
			Name : sName,
			Lvl  : nLvl
		});
	}

	this.SetStylesArray(arrStyles);
};
CFieldInstructionTOC.prototype.SetStylesArray = function(arrStyles)
{
	this.Styles = arrStyles;
};
CFieldInstructionTOC.prototype.GetStylesArray = function()
{
	return this.Styles;
};
CFieldInstructionTOC.prototype.SetPageRefSkippedLvls = function(isSkip, nSkipStart, nSkipEnd)
{
	this.SkipPageRef = isSkip;

	if (true === isSkip
		&& null !== nSkipStart
		&& undefined !== nSkipStart
		&& null !== nSkipEnd
		&& undefined !== nSkipEnd)
	{
		this.SkipPageRefStart = nSkipStart;
		this.SkipPageRefEnd   = nSkipEnd;
	}
	else
	{
		this.SkipPageRefStart = -1;
		this.SkipPageRefEnd   = -1;
	}
};
CFieldInstructionTOC.prototype.IsSkipPageRefLvl = function(nLvl)
{
	if (false === this.SkipPageRef)
		return false;

	if (-1 === this.SkipPageRefStart || -1 === this.SkipPageRefEnd)
		return true;

	return  (nLvl >= this.SkipPageRefStart - 1 && nLvl <= this.SkipPageRefEnd - 1);
};



/**
 * Класс для разбора строки с инструкцией
 * @constructor
 */
function CFieldInstructionParser()
{
	this.Line   = "";
	this.Pos    = 0;
	this.Buffer = "";
	this.Result = null;

	this.SavedStates = [];
}
CFieldInstructionParser.prototype.GetInstructionClass = function(sLine)
{
	this.Line   = sLine;
	this.Pos    = 0;
	this.Buffer = "";
	this.Result = null;

	this.private_Parse();

	return this.Result;
};
CFieldInstructionParser.prototype.private_Parse = function()
{
	if (!this.private_ReadNext())
		return;

	switch (this.Buffer.toUpperCase())
	{
		case "PAGE": this.private_ReadPAGE(); break;
		case "PAGEREF": this.private_ReadPAGEREF(); break;
		case "TOC": this.private_ReadTOC(); break;
	}
};
CFieldInstructionParser.prototype.private_ReadNext = function()
{
	var nLen  = this.Line.length,
		bWord = false;

	this.Buffer = "";

	while (this.Pos < nLen)
	{
		var nCharCode = this.Line.charCodeAt(this.Pos);
		if (32 === nCharCode || 9 === nCharCode)
		{
			if (bWord)
				return true;
		}
		else if (34 === nCharCode)
		{
			// Кавычки
			this.Pos++;
			while (this.Pos < nLen)
			{
				nCharCode = this.Line.charCodeAt(this.Pos);
				if (34 === nCharCode)
				{
					this.Pos++;
					break;
				}

				bWord = true;
				this.Buffer += this.Line.charAt(this.Pos);
				this.Pos++;
			}

			return bWord;
		}
		else
		{
			this.Buffer += this.Line.charAt(this.Pos);
			bWord = true;
		}

		this.Pos++;
	}

	if (bWord)
		return true;

	return false;
};
CFieldInstructionParser.prototype.private_ReadArguments = function()
{
	var arrArguments = [];

	var sArgument = this.private_ReadArgument();
	while (null !== sArgument)
	{
		arrArguments.push(sArgument);
		sArgument = this.private_ReadArgument();
	}

	return arrArguments;
};
CFieldInstructionParser.prototype.private_ReadArgument = function()
{
	this.private_SaveState();

	if (!this.private_ReadNext())
		return null;

	if (this.private_IsSwitch())
	{
		this.private_RestoreState();
		return null;
	}

	this.private_RemoveLastState();
	return this.Buffer;
};
CFieldInstructionParser.prototype.private_IsSwitch = function()
{
	return this.Buffer.charAt(0) === '\\';
};
CFieldInstructionParser.prototype.private_GetSwitchLetter = function()
{
	return this.Buffer.charAt(1);
};
CFieldInstructionParser.prototype.private_SaveState = function()
{
	this.SavedStates.push(this.Pos);
};
CFieldInstructionParser.prototype.private_RestoreState = function()
{
	if (this.SavedStates.length > 0)
		this.Pos = this.SavedStates[this.SavedStates.length - 1];

	this.private_RemoveLastState();
};
CFieldInstructionParser.prototype.private_RemoveLastState = function()
{
	if (this.SavedStates.length > 0)
		this.SavedStates.splice(this.SavedStates.length - 1, 1);
};
CFieldInstructionParser.prototype.private_ReadGeneralFormatSwitch = function()
{
	if (!this.private_IsSwitch() || this.Buffer.charAt(1) !== '*')
		return;

	if (!this.private_ReadNext() || this.private_IsSwitch())
		return;

	// TODO: Тут надо прочитать поле

	console.log("General switch: " + this.Buffer);
};
CFieldInstructionParser.prototype.private_ReadPAGE = function()
{
	this.Result = new CFieldInstructionPAGE();

	// Zero or more general-formatting-switches

	while (this.private_ReadNext())
	{
		if (this.private_IsSwitch())
			this.private_ReadGeneralFormatSwitch();
	}
};
CFieldInstructionParser.prototype.private_ReadPAGEREF = function()
{
	var sBookmarkName = null;
	var isHyperlink = false, isPageRel = false;

	var isSwitch = false, isBookmark = false;

	while (this.private_ReadNext())
	{
		if (this.private_IsSwitch())
		{
			isSwitch = true;

			if ('p' === this.Buffer.charAt(1))
				isPageRel = true;
			else if ('h' === this.Buffer.charAt(1))
				isHyperlink = true;
		}
		else if (!isSwitch && !isBookmark)
		{
			sBookmarkName = this.Buffer;
			isBookmark    = true;
		}
	}

	this.Result = new CFieldInstructionPAGEREF(sBookmarkName, isHyperlink, isPageRel);
};
CFieldInstructionParser.prototype.private_ReadTOC = function()
{
	// TODO: \a, \b, \c, \d, \f, \l, \s, \z, \u

	this.Result = new CFieldInstructionTOC();

	while (this.private_ReadNext())
	{
		if (this.private_IsSwitch())
		{
			var sType = this.private_GetSwitchLetter();
			if ('w' === sType)
			{
				this.Result.SetPreserveTabs(true);
			}
			else if ('x' === sType)
			{
				this.Result.SetRemoveBreaks(false);
			}
			else if ('h' === sType)
			{
				this.Result.SetHyperlinks(true);
			}
			else if ('p' === sType)
			{
				var arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
					this.Result.SetSeparator(arrArguments[0]);
			}
			else if ('o' === sType)
			{
				var arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
				{
					var arrRange = this.private_ParseIntegerRange(arrArguments[0]);
					if (null !== arrRange)
						this.Result.SetHeadingRange(arrRange[0], arrRange[1]);
				}
			}
			else if ('t' === sType)
			{
				var arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
					this.Result.SetStylesArrayRaw(arrArguments[0]);
			}
			else if ('n' === sType)
			{
				var arrArguments = this.private_ReadArguments();
				if (arrArguments.length > 0)
				{
					var arrRange = this.private_ParseIntegerRange(arrArguments[0]);
					if (null !== arrRange)
						this.Result.SetPageRefSkippedLvls(true, arrRange[0], arrRange[1]);
					else
						this.Result.SetPageRefSkippedLvls(true, -1, -1);
				}
				else
				{
					this.Result.SetPageRefSkippedLvls(true, -1, -1);
				}
			}
		}


	}

};
CFieldInstructionParser.prototype.private_ParseIntegerRange = function(sValue)
{
	// value1-value2

	var nSepPos = sValue.indexOf("-");
	if (-1 === nSepPos)
		return null;

	var nValue1 = parseInt(sValue.substr(0, nSepPos));
	var nValue2 = parseInt(sValue.substr(nSepPos + 1));

	if (isNaN(nValue1) || isNaN(nValue2))
		return null;

	return [nValue1, nValue2];
};



