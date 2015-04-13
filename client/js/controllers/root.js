module.exports = function() {
	return ['$scope', function($scope) {
		$scope.card = {
			lux: {
				'version' : '0.1.1',
				'shiny' : false,
				'rank' : 'UNRANKED',
				'type' : 'URF_5x5',
				'region' : 'EUW',
				'champion' : {
					'id' : 99,
					'key' : 'Lux',
					'name' : 'Lux',
					'title' : 'the Lady of Luminosity',
					'lore' : 'Born to the prestigious Crownguards, the paragon family of Demacian service, Luxanna was destined for greatness. She grew up as the family\'s only daughter, and she immediately took to the advanced education and lavish parties required of families as high profile as the Crownguards. As Lux matured, it became clear that she was extraordinarily gifted. She could play tricks that made people believe they had seen things that did not actually exist. She could also hide in plain sight. Somehow, she was able to reverse engineer arcane magical spells after seeing them cast only once. She was hailed as a prodigy, drawing the affections of the Demacian government, military, and citizens alike.<br><br>As one of the youngest women to be tested by the College of Magic, she was discovered to possess a unique command over the powers of light. The young Lux viewed this as a great gift, something for her to embrace and use in the name of good. Realizing her unique skills, the Demacian military recruited and trained her in covert operations. She quickly became renowned for her daring achievements; the most dangerous of which found her deep in the chambers of the Noxian High Command. She extracted valuable inside information about the Noxus-Ionian conflict, earning her great favor with Demacians and Ionians alike. However, reconnaissance and surveillance was not for her. A light of her people, Lux\'s true calling was the League of Legends, where she could follow in her brother\'s footsteps and unleash her gifts as an inspiration for all of Demacia.<br><br> Her guiding light makes enemies wary, but they should worry most when the light fades.<br> - Garen, The Might of Demacia',
					'blurb' : 'Born to the prestigious Crownguards, the paragon family of Demacian service, Luxanna was destined for greatness. She grew up as the family\'s only daughter, and she immediately took to the advanced education and lavish parties required of families as ...',
					'allytips' : [
						'Lux has great zone control abilities. Try to set up Lucent Singularity to prevent an enemy\'s advance or escape.',
					'If you have trouble landing Prismatic Barrier, remember that it returns to you after it reaches max range. Try positioning yourself to hit your allies with its return trip.',
					'Lucent Singularity is a great scouting tool. Try throwing it into brush before walking into it to check for ambushes.'
						],
					'enemytips' : [
						'Lux has powerful zone control abilities. Try to spread out and attack from different directions so she cannot lock down a specific area.',
					'When retreating with low health, be prepared to dodge Lux\'s Final Spark, a red targeting beam fires prior to the main beam, so try to move to the side if possible.'
						],
					'tags' : [
						'Mage',
					'Support'
						],
					'partype' : 'Mana',
					'info' : {
						'attack' : 2,
						'defense' : 4,
						'magic' : 9,
						'difficulty' : 5
					},
					'stats' : {
						'armor' : 18.72,
						'armorperlevel' : 4,
						'attackdamage' : 53.544,
						'attackdamageperlevel' : 3.3,
						'attackrange' : 550,
						'attackspeedoffset' : 0,
						'attackspeedperlevel' : 1.36,
						'crit' : 0,
						'critperlevel' : 0,
						'hp' : 477.71999999999997,
						'hpperlevel' : 79,
						'hpregen' : 5.42,
						'hpregenperlevel' : 0.55,
						'movespeed' : 330,
						'mp' : 334,
						'mpperlevel' : 50,
						'mpregen' : 6,
						'mpregenperlevel' : 0.8,
						'spellblock' : 30,
						'spellblockperlevel' : 0
					},
					'passive' : {
						'name' : 'Illumination',
						'description' : 'Lux\'s damaging spells charge the target with energy for 6 seconds. Lux\'s next attack ignites the energy, dealing bonus magic damage (depending on Lux\'s level) to the target.',
						'sanitizedDescription' : 'Lux\'s damaging spells charge the target with energy for 6 seconds. Lux\'s next attack ignites the energy, dealing bonus magic damage (depending on Lux\'s level) to the target.',
						'image' : {
							'full' : 'LuxIlluminatingFraulein.png',
							'sprite' : 'passive1.png',
							'group' : 'passive',
							'x' : 240,
							'y' : 96,
							'w' : 48,
							'h' : 48
						}
					}
				},
				'stats' : {
					'assists' : 8,
					'deaths' : 8,
					'goldEarned' : 10548,
					'kills' : 2,
					'largestKillingSpree' : 0,
					'winSpeed' : -1
				},
				'championImage' : {
					'image' : {
						'full' : 'Lux.png',
						'sprite' : 'champion1.png',
						'group' : 'champion',
						'x' : 240,
						'y' : 96,
						'w' : 48,
						'h' : 48
					},
					'skins' : [
					{
						'id' : 99000,
						'name' : 'default',
						'num' : 0
					},
					{
						'id' : 99001,
						'name' : 'Sorceress Lux',
						'num' : 1
					},
					{
						'id' : 99002,
						'name' : 'Spellthief Lux',
						'num' : 2
					},
					{
						'id' : 99003,
						'name' : 'Commando Lux',
						'num' : 3
					},
					{
						'id' : 99004,
						'name' : 'Imperial Lux',
						'num' : 4
					},
					{
						'id' : 99005,
						'name' : 'Steel Legion Lux',
						'num' : 5
					}
					]
				}
			}
		};
		console.log(JSON.stringify($scope.card.lux));
	}];
};
