import { RichEmbed, MessageEmbed } from 'discord.js';
import moment = require('moment');
import Logger from '../managers/logger';
import ReplacementDay from './replacementDay';

export enum ReplacementsEmbedFooterType { NONE, GENERATED_ON, UPDATED_ON}
export class ReplacementsEmbed
{
	data: ReplacementDay[];
	constructor(data: ReplacementDay[] | ReplacementDay)
	{
		if(data instanceof ReplacementDay)
		{
			data = [ data ];
		}
		this.data = data;
	}

	public addDays(data: ReplacementDay): void
	{
		this.data.push(data);
	}

	public build(title: string, footerType: ReplacementsEmbedFooterType): RichEmbed
	{
		const richEmbed = new RichEmbed();

		richEmbed.setTitle(title)
			.setColor('DARK_VIVID_PINK')
			.setThumbnail('https://cdn.pixabay.com/photo/2019/08/11/18/50/icon-4399684_960_720.png')
			.setFooter(this.getFooter(footerType, moment()));

		for(const replacementDay of this.data)
		{
			richEmbed.addField(
				this.data.length > 1 ? `Replacements for: ${replacementDay.getWeekDay()}` : 'Replacements list:',
				replacementDay.toString(false));
		}

		return richEmbed;
	}

	private getFooter(type: ReplacementsEmbedFooterType, date?: moment.Moment): string
	{
		if(!date && type != ReplacementsEmbedFooterType.NONE)
		{
			Logger.error('Cannot generate embed footer without date');
			return '';
		}
		switch(type)
		{
		case ReplacementsEmbedFooterType.NONE:
			return null;
		case ReplacementsEmbedFooterType.GENERATED_ON:
			return 'Generated on: ' + date.format('dddd HH:mm');
		case ReplacementsEmbedFooterType.UPDATED_ON:
			return 'Updated on: ' + date.format('dddd HH:mm');
		}
	}

	public static compareEmbeds(a: RichEmbed, b: MessageEmbed): boolean
	{
		for (let index = 0; index < a.fields.length; index++)
		{
			if(a.fields[index].name != b.fields[index].name) return false;
			if(a.fields[index].value != b.fields[index].value) return false;
		}

		return (a.author == b.author && a.color == b.color && a.description == b.description && a.title == b.title);
	}
}
