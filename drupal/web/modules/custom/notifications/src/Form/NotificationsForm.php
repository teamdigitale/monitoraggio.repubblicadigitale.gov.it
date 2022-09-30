<?php

namespace Drupal\notifications\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class NotificationsForm extends ConfigFormBase{
  public const NOTIFICATIONS_KEYS = [
    'board' => [
      'label'=> 'Bacheca',
      'sections'=> [
        'update' => [
          'label'=> 'Aggiornamento news',
          'default_message' => "ha aggiornato la news {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo della news'
          ]
        ],
        'delete'=> [
          'label'=> 'Eliminazione news',
          'default_message' => "ha cancellato la news {TITLE} con la seguente motivazione:'{REASON}'.",
          'placeholders' => [
            '{TITLE}' => 'Titolo della news',
            '{REASON}' => 'Motivo della cancellazione'
          ]
        ],
        'like'=>[
          'label'=> 'Like news',
          'default_message' => "ha messo mi piace alla news {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo della news'
          ]
        ],
        'comment'=>[
          'label'=> 'Commento ad una news',
          'default_message' => "ha commentato la news {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo della news'
          ]
        ],
        'report'=>[
          'label'=> 'Segnalazione news',
          'default_message' => "ha segnalato la news {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo della news'
          ]
        ],
      ]
    ],
    'community' => [
      'label'=> 'Community',
      'sections'=> [
        'update' => [
          'label'=> 'Aggiornamento topic',
          'default_message' => "ha aggiornato il topic {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del topic'
          ]
        ],
        'delete'=> [
          'label'=> 'Eliminazione topic',
          'default_message' => "ha cancellato il topic {TITLE} con la seguente motivazione:'{REASON}'.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del topic',
            '{REASON}' => 'Motivo della cancellazione'
          ]
        ],
        'like'=>[
          'label'=> 'Like topic',
          'default_message' => "ha messo mi piace al topic {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del topic'
          ]
        ],
        'comment'=>[
          'label'=> 'Commento a un topic',
          'default_message' => "ha commentato il topic {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del topic'
          ]
        ],
        'report'=>[
          'label'=> 'Segnalazione topic',
          'default_message' => "ha segnalato il topic {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del topic'
          ]
        ],
      ]
    ],
    'document' => [
      'label'=> 'Documenti',
      'sections'=> [
        'update' => [
          'label'=> 'Aggiornamento documento',
          'default_message' => "ha aggiornato il documento {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del documento'
          ]
        ],
        'delete'=> [
          'label'=> 'Eliminazione documento',
          'default_message' => "ha cancellato il documento {TITLE} con la seguente motivazione:'{REASON}'.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del documento',
            '{REASON}' => 'Motivo della cancellazione'
          ]
        ],
        'like'=>[
          'label'=> 'Like documento',
          'default_message' => "ha messo mi piace al documento {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del documento'
          ]
        ],
        'comment'=>[
          'label'=> 'Commento a un documento',
          'default_message' => "ha commentato il documento {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del documento'
          ]
        ],
        'report'=>[
          'label'=> 'Segnalazione documento',
          'default_message' => "ha segnalato il documento {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del documento'
          ]
        ],
      ]
    ],
    'comment' => [
      'label'=> 'Commenti',
      'sections'=> [
        'update' => [
          'label'=> 'Aggiornamento commento',
          'default_message' => "ha aggiornato un tuo commento.",
          'placeholders' => []
        ],
        'delete'=> [
          'label'=> 'Eliminazione commento',
          'default_message' => "ha cancellato un tuo commento con la seguente motivazione:'{REASON}'.",
          'placeholders' => [
            '{REASON}' => 'Motivo della cancellazione'
            ]
        ],
        'like'=>[
          'label'=> 'Like commento',
          'default_message' => "ha messo mi piace ad un tuo commento.",
          'placeholders' => []
        ],
        'reply'=>[
          'label'=> 'Risposta ad un commento',
          'default_message' => "ha risposto ad un tuo commento.",
          'placeholders' => []
        ],
        'report'=>[
          'label'=> 'Segnalazione commento',
          'default_message' => "ha segnalato il commento di {CONTENT_AUTHOR} in {TITLE}.",
          'placeholders' => [
            '{TITLE}' => 'Titolo del documento',
            '{CONTENT_AUTHOR}' => 'Autore del commento'
          ]
        ]
      ]
    ]
  ];

  /**
   * Returns a unique string identifying the form.
   *
   * The returned ID should be a unique string that can be a valid PHP function
   * name, since it's used in hook implementation names such as
   * hook_form_FORM_ID_alter().
   *
   * @return string
   *   The unique string identifying the form.
   */
  public function getFormId()
  {
    return 'notifications_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'notifications_messages.config',
    ];
  }

  /**
   * Form constructor.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param FormStateInterface $form_state
   *   The current state of the form.
   * @param null $group
   *
   * @return array
   *   The form structure.
   */
  public function buildForm(array $form, FormStateInterface $form_state, $group = null) {
    $config = \Drupal::configFactory()->getEditable('notifications_messages.config');

    $weight = 0;
    $form['#tree'] = TRUE;
    $form['advanced'] = [
      '#type' => 'vertical_tabs',
      '#title' => t('Notification messages'),
      '#weight' => $weight,
    ];

    foreach (self::NOTIFICATIONS_KEYS as $tab => $tab_values) {
      $weight++;
      $form[$tab] = [
        '#type' => 'details',
        '#title' => $tab_values['label'],
        '#group' => 'advanced',
        '#weight' => $weight,
      ];

      foreach ($tab_values['sections'] as $section => $section_values) {

        $placeholders = $this->t('');
        if (!empty($section_values['placeholders'])) {

          $stringPlaceholders = "<br>Puoi usare i seguenti placeholder:
                  <br>";
          foreach($section_values['placeholders'] as $key => $value) {
            $stringPlaceholders = $stringPlaceholders."<b>" . $key . "</b> => " . $value . "
                  <br>" ;
          }
          $placeholders = $this->t($stringPlaceholders);
        }

        $form[$tab][$section] = [
          '#type' => 'details',
          '#title' => $this->t($section_values['label']),
          '#collapsed' => false
        ];
        $form[$tab][$section]['message'] = [
          '#type' => 'textarea',
          '#rows' => 2,
          '#attributes' =>array(
            'col' => 2,
          ),
          '#title' => $this->t('Messaggio'),
          '#description' => $this->t('Inserisci il messaggio') . $placeholders,
          '#required' => true,
          '#default_value' => $config->get($tab.'_'.$section) ? $config->get($tab.'_'.$section) : $section_values['default_message']
        ];
      }
    }

    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save'),
      '#button_type' => 'primary',
    ];
    return $form;
  }

  /**
   * Validate the title and the checkbox of the form
   *
   * @param array $form
   * @param FormStateInterface $form_state
   *
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
  }

  /**
   * Form submission handler.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param FormStateInterface $form_state
   *   The current state of the form.
   * @return array
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $config = \Drupal::configFactory()->getEditable('notifications_messages.config');
    foreach(self::NOTIFICATIONS_KEYS as $tab => $tab_values) {
      foreach ($tab_values['sections'] as $section => $section_values ) {
        $value = $form_state->getValue($tab);
        $message = $value[$section]['message'];
        $config->set($tab.'_'.$section, $message);
      }
    }
    $config->save();
    return $form;
  }
}
