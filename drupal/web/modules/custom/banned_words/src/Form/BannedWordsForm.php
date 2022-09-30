<?php

namespace Drupal\banned_words\Form;

use Drupal\Core\Config\Config;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class ConfigForm.
 */
class BannedWordsForm extends ConfigFormBase {
  const KEY_TITLE = 'title';
  const KEY_BODY = 'list';

  const KEY_BANNED_WORDS_LIST = 'banned_words_list';
  const KEY_BANNED_WORDS = 'banned_words';

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames()
  {
    return [
      'banned_words.config',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId()
  {
    return 'banned_words_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state)
  {
    $config = $this->config('banned_words.config');

    $form['advanced'] = array(
      '#type' => 'vertical_tabs',
      '#title' => t('Settings'),
    );

    $form[self::KEY_BANNED_WORDS] = $this->addConfigurationBannedWordsTab($config);

    return parent::buildForm($form, $form_state);
  }

  /**
   * @param Config $config
   * @return array
   */
  private function addConfigurationBannedWordsTab(Config $config)
  {
    $form = [
      '#type' => 'details',
      '#title' => t('Banned Words'),
      '#group' => 'advanced',
    ];

    $form[][self::KEY_BANNED_WORDS_LIST] = [
      '#type' => 'textarea',
      '#title' => $this->t("Legenda: inserisci le parole bannate separate da ' ; '"),
      '#rows' => 50,
      '#default_value' => $config->get(self::KEY_BANNED_WORDS_LIST),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state)
  {
    parent::submitForm($form, $form_state);

    $this->config('banned_words.config')
      ->delete()
      ->set(self::KEY_BANNED_WORDS, $form_state->getValue(self::KEY_BANNED_WORDS))
      ->set(self::KEY_TITLE, $form_state->getValue(self::KEY_TITLE))
      ->set(self::KEY_BODY, $form_state->getValue(self::KEY_BODY))
      ->set(self::KEY_BANNED_WORDS_LIST, $form_state->getValue(self::KEY_BANNED_WORDS_LIST))
      ->save();
  }
}
